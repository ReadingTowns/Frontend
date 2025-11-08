'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTown, getTownByCoordinates } from '@/services/townService'
import type { UpdateTownRequest } from '@/types/town'
import {
  MapPinIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline'
import { Modal } from '@/components/common/Modal'

interface TownEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentTown?: string
}

export default function TownEditModal({
  isOpen,
  onClose,
  currentTown,
}: TownEditModalProps) {
  const queryClient = useQueryClient()
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [townName, setTownName] = useState<string>('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const updateTownMutation = useMutation({
    mutationFn: async (data: UpdateTownRequest) => {
      return await updateTown(data)
    },
    onSuccess: () => {
      // Invalidate profile cache to refresh town info
      queryClient.invalidateQueries({ queryKey: ['members', 'me', 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['members', 'town'] })
      onClose()
    },
    onError: error => {
      console.error('Town update error:', error)
    },
  })

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setLatitude(lat)
        setLongitude(lon)

        // 위경도로 동네 이름 조회
        try {
          const townData = await getTownByCoordinates(lon, lat)
          setTownName(townData.currentTown)
        } catch (error) {
          console.error('동네 정보를 가져올 수 없습니다:', error)
          setTownName('동네 이름을 가져올 수 없습니다')
        }

        setIsGettingLocation(false)
      },
      error => {
        console.error('Geolocation error:', error)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (latitude === 0 || longitude === 0) {
      return
    }

    updateTownMutation.mutate({
      latitude,
      longitude,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="동네 인증"
      closeOnBackdropClick={false}
      closeOnEsc={!updateTownMutation.isPending && !isGettingLocation}
      size="md"
      showCloseButton={!updateTownMutation.isPending}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* 현재 동네 표시 */}
        {currentTown && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">현재 설정된 동네</p>
            <p className="font-medium text-gray-900">{currentTown}</p>
          </div>
        )}

        {/* 위치 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            위치 정보
          </label>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <MapPinIcon className="w-5 h-5" />
            {isGettingLocation
              ? '위치 가져오는 중...'
              : '현재 위치로 동네 인증하기'}
          </button>
          {latitude !== 0 && longitude !== 0 && (
            <div className="mt-3 text-sm bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-green-800 font-medium mb-1 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                GPS 위치 확인 완료
              </p>
              {townName && (
                <p className="text-base text-green-900 font-bold mt-2">
                  📍 {townName}
                </p>
              )}
              <p className="text-xs text-green-600 mt-2">
                위도: {latitude.toFixed(6)} / 경도: {longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5 flex-shrink-0" />
            GPS 위치를 기반으로 자동으로 동네가 설정됩니다
          </p>
        </div>

        {/* 제출 버튼 */}
        {latitude !== 0 && longitude !== 0 && (
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updateTownMutation.isPending}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={updateTownMutation.isPending}
              className="flex-1 py-3 bg-primary-400 text-white rounded-lg font-medium hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {updateTownMutation.isPending ? '저장 중...' : '이 위치로 설정'}
            </button>
          </div>
        )}
      </form>
    </Modal>
  )
}
