'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'
import ProfileSection from './components/ProfileSection'
import TabNavigation from './components/TabNavigation'
import SettingsTab from './components/SettingsTab'
import NotificationTab from './components/NotificationTab'
import LogoutModal from './components/LogoutModal'

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

type TabType = 'settings' | 'notifications'

export default function MypageClient() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [activeTab, setActiveTab] = useState<TabType>('settings')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // 읽지 않은 알림 수 조회
  const unreadCount = useUnreadNotificationCount()

  useEffect(() => {
    setHeaderContent(
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent])

  // Mock data for testing
  const mockProfile: UserProfile = {
    memberId: 1,
    nickname: '테스트사용자',
    profileImage: 'https://picsum.photos/seed/user1/200',
    phoneNumber: '010-1234-5678',
    currentTown: '강남구 삼성동',
    availableTime: '평일 저녁 / 주말 오전',
    userRating: 4.5,
    userRatingCount: 10,
  }

  const {
    data: profile = mockProfile, // Use mock data as fallback
    isLoading,
    error,
  } = useQuery<UserProfile>({
    queryKey: ['members', 'me', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/v1/members/me/profile', {
        credentials: 'include',
      })
      const data = await response.json()

      // Check for API error codes
      if (data.code && data.code !== '1000' && data.code !== 1000) {
        // In test/demo mode, return mock data instead of throwing error
        if (process.env.NODE_ENV === 'development') {
          return mockProfile
        }
        throw new Error(data.message || '프로필을 불러오는데 실패했습니다')
      }

      if (!response.ok) {
        // In test/demo mode, return mock data instead of throwing error
        if (process.env.NODE_ENV === 'development') {
          return mockProfile
        }
        throw new Error('프로필을 불러오는데 실패했습니다')
      }

      return data.result || mockProfile
    },
    retry: false, // Disable retry in development
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('로그아웃 실패')
      }
      return response.json()
    },
    onSuccess: () => {
      router.push('/login')
    },
    onError: error => {
      console.error('로그아웃 에러:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
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
        {profile && (
          <>
            <ProfileSection profile={profile} />

            <div className="bg-white">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                unreadCount={unreadCount}
              />

              {activeTab === 'settings' ? (
                <SettingsTab onShowLogout={() => setShowLogoutModal(true)} />
              ) : (
                <NotificationTab />
              )}
            </div>
          </>
        )}
      </div>

      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          isLoading={logoutMutation.isPending}
        />
      )}
    </div>
  )
}
