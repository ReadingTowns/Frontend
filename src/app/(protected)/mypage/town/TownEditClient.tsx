'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import TownEditModal from '@/components/profile/TownEditModal'
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  LightBulbIcon,
  BookOpenIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface UserProfile {
  memberId: number
  nickname: string
  profileImage?: string
  phoneNumber?: string
  currentTown?: string
  availableTime?: string
  userRating?: number
  userRatingCount: number
}

export default function TownEditClient() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [showTownModal, setShowTownModal] = useState(false)

  useEffect(() => {
    setHeaderContent(
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">동네 설정</h1>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, router])

  // 현재 프로필 정보 가져오기
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['members', 'me', 'profile'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const response = await fetch(`${backendUrl}/api/v1/members/me/profile`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('프로필을 불러오는데 실패했습니다')
      }
      const data = await response.json()
      return data.result
    },
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ClockIcon className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-4">
        {/* 현재 동네 정보 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">현재 동네</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.currentTown || '동네 미설정'}
              </p>
              <p className="text-sm text-gray-500">
                {profile?.currentTown
                  ? '동네 인증이 완료되었습니다'
                  : '동네 인증 후 근처 이웃과 책을 교환할 수 있어요'}
              </p>
            </div>
            <div className="ml-4">
              <MapPinIcon className="w-12 h-12 text-primary-500" />
            </div>
          </div>
        </div>

        {/* 동네 변경 안내 */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-4">
          <div className="flex gap-3">
            <LightBulbIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">동네 인증 방법</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GPS 위치를 기반으로 자동으로 동네가 설정됩니다</li>
                <li>• 정확한 위치 측정을 위해 위치 권한이 필요합니다</li>
                <li>• 동네는 언제든지 다시 변경할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 동네 변경 버튼 */}
        <button
          onClick={() => setShowTownModal(true)}
          className="w-full py-4 bg-primary-400 text-white rounded-2xl font-bold text-lg hover:bg-primary-500 transition-colors shadow-sm"
        >
          {profile?.currentTown ? '동네 변경하기' : '동네 인증하기'}
        </button>

        {/* 동네 혜택 안내 */}
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-gray-900">동네 인증 혜택</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
              <BookOpenIcon className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">근처 이웃과 책 교환</p>
                <p className="text-sm text-gray-500">
                  가까운 거리의 이웃과 편리하게 책을 교환할 수 있어요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
              <GlobeAltIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">맞춤 추천</p>
                <p className="text-sm text-gray-500">
                  내 동네 이웃들의 책과 취향을 우선적으로 추천받아요
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
              <UserGroupIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">동네 커뮤니티</p>
                <p className="text-sm text-gray-500">
                  같은 동네 독서 모임과 북클럽에 참여할 수 있어요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 동네 인증 모달 */}
      <TownEditModal
        isOpen={showTownModal}
        onClose={() => setShowTownModal(false)}
        currentTown={profile?.currentTown}
      />
    </div>
  )
}
