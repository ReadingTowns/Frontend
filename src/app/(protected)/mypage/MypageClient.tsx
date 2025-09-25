'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import ProfileSection from './components/ProfileSection'
import MenuList from './components/MenuList'
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

export default function MypageClient() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<UserProfile>({
    queryKey: ['members', 'me', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/v1/members/me/profile', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('프로필을 불러오는데 실패했습니다')
      }
      const data = await response.json()
      return data.result
    },
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

  const menuItems = [
    {
      id: 'profile',
      title: '프로필 수정',
      icon: '👤',
      onClick: () => router.push('/mypage/profile'),
    },
    {
      id: 'reading-habit',
      title: '독서 습관 설정',
      icon: '📚',
      onClick: () => router.push('/mypage/reading-habit'),
    },
    {
      id: 'notifications',
      title: '알림 설정',
      icon: '🔔',
      onClick: () => router.push('/mypage/notifications'),
    },
    {
      id: 'about',
      title: '앱 정보',
      icon: 'ℹ️',
      onClick: () => router.push('/mypage/about'),
    },
    {
      id: 'logout',
      title: '로그아웃',
      icon: '🚪',
      onClick: () => setShowLogoutModal(true),
      isDanger: true,
    },
  ]

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
            <MenuList items={menuItems} />
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
