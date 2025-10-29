'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import { useAuth } from '@/hooks/useAuth'
import { useMyRating } from '@/hooks/useUserRating'
import ProfileSection from './components/ProfileSection'
import SettingsTab from './components/SettingsTab'
import LogoutModal from './components/LogoutModal'
import { api } from '@/lib/api'

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

export default function MypageClient() {
  const { logout, isLoggingOut } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // 새로운 헤더 시스템 사용
  useHeaderConfig({
    variant: 'basic',
    title: '마이페이지',
  })

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<UserProfile>({
    queryKey: ['members', 'me', 'profile'],
    queryFn: async () => {
      return await api.get<UserProfile>('/api/v1/members/me/profile')
    },
    retry: 1, // Retry once on failure
  })

  // 실시간 별점 데이터 조회
  const { data: myRating } = useMyRating()

  // 별점 데이터 우선순위: useMyRating hook > profile 데이터
  const displayProfile = profile
    ? {
        ...profile,
        userRating: myRating?.userRating ?? profile.userRating,
        userRatingCount: myRating?.userRatingCount ?? profile.userRatingCount,
      }
    : profile

  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2" />
          <div className="h-3 bg-gray-200 rounded w-24 mx-auto" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">프로필을 불러올 수 없습니다</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        {displayProfile && (
          <>
            <ProfileSection profile={displayProfile} />
            <div className="bg-white">
              <SettingsTab onShowLogout={() => setShowLogoutModal(true)} />
            </div>
          </>
        )}
      </div>

      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          isLoading={isLoggingOut}
        />
      )}
    </div>
  )
}
