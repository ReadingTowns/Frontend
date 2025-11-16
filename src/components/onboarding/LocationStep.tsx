import { useState, useEffect } from 'react'
import { showError } from '@/lib/toast'
import { LocationStepProps } from '@/types/onboarding'
import { MapPinIcon, MapIcon } from '@heroicons/react/24/solid'
import { getTownByCoordinates } from '@/services/townService'

export default function LocationStep({
  latitude,
  longitude,
  onLocationChange,
  onBack,
  onSkip,
}: LocationStepProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  )
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getCurrentLocation = () => {
    setIsLoading(true)

    if (!navigator.geolocation) {
      showError('위치 서비스를 지원하지 않는 브라우저입니다')
      setIsLoading(false)
      return
    }

    // 성공 콜백 함수
    const onSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      handleLocationSet(latitude, longitude)

      // 위경도로 동네 이름 조회
      try {
        const townData = await getTownByCoordinates(longitude, latitude)
        setAddress(townData.currentTown)
      } catch (error) {
        console.error('동네 정보를 가져올 수 없습니다:', error)
        setAddress('현재 위치')
      }

      setIsLoading(false)
    }

    // 에러 콜백 함수
    const onError = (error: GeolocationPositionError) => {
      console.error('위치 정보를 가져올 수 없습니다:', error)

      // POSITION_UNAVAILABLE 에러 시 낮은 정확도로 재시도
      if (error.code === error.POSITION_UNAVAILABLE) {
        console.log('GPS 실패, Wi-Fi/네트워크 위치로 재시도 중...')
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          fallbackError => {
            console.error('재시도 실패:', fallbackError)
            showError(
              '위치 정보를 가져올 수 없습니다. Wi-Fi 또는 데이터 연결을 확인해주세요.'
            )
            setIsLoading(false)
          },
          {
            enableHighAccuracy: false, // 낮은 정확도 (Wi-Fi/네트워크)
            timeout: 10000,
            maximumAge: 0,
          }
        )
        return
      }

      // 에러 타입별 메시지
      let errorMessage = '위치 정보를 가져올 수 없습니다.'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
          break
        case error.TIMEOUT:
          errorMessage = '위치 요청 시간이 초과되었습니다. 다시 시도해주세요.'
          break
      }

      showError(errorMessage)
      setIsLoading(false)
    }

    // 첫 번째 시도: 높은 정확도 (GPS)
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true, // 정확도 우선 (GPS)
      timeout: 10000, // 10초 타임아웃
      maximumAge: 0, // 캐시 사용 안 함
    })
  }

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ lat: latitude, lng: longitude })
    }
  }, [latitude, longitude])

  const handleLocationSet = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    onLocationChange(lat, lng)
  }

  return (
    <div className="px-4 py-8">
      {/* 이전 버튼 */}
      <button onClick={onBack} className="btn-ghost text-left mb-4">
        ← 이전
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        동네를 설정해주세요
      </h2>
      <p className="text-gray-600 mb-8">
        가까운 이웃들과 책을 교환할 수 있어요
      </p>

      <div className="mb-6">
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          {location ? (
            <div className="text-center">
              <MapPinIcon className="w-12 h-12 text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{address}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <MapIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">위치를 설정해주세요</p>
            </div>
          )}
        </div>

        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="btn-secondary"
        >
          {isLoading ? '위치 확인 중...' : '현재 위치로 설정'}
        </button>

        {/* 건너뛰기 버튼 */}
        <button onClick={onSkip} className="btn-ghost mt-3 w-full">
          나중에 설정하기
        </button>
      </div>
    </div>
  )
}
