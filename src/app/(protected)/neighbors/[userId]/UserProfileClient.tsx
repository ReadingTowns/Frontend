'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useHeader } from '@/contexts/HeaderContext'
import FollowButton from '@/components/neighbors/FollowButton'
import UserProfileHeader from '@/components/neighbors/UserProfileHeader'

interface UserProfile {
  memberId: number
  profileImage: string
  nickname: string
  currentTown: string
  userRating: number | null
  userRatingCount: number
  availableTime: string | null
  following: boolean
}

interface UserRating {
  memberId: number
  userRatingSum: number
  userRatingCount: number
  userRating: number | null
}

interface UserProfileClientProps {
  userId: string
}

export default function UserProfileClient({ userId }: UserProfileClientProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setHeaderContent } = useHeader()
  const [activeTab, setActiveTab] = useState<'library' | 'reviews'>('library')

  // 프로필 조회
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['users', userId, 'profile'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(`${backendUrl}/api/v1/members/${userId}/profile`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      return data.result as UserProfile
    },
  })

  // 별점 조회
  const { data: rating } = useQuery({
    queryKey: ['users', userId, 'rating'],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const res = await fetch(
        `${backendUrl}/api/v1/members/star-rating?memberId=${userId}`
      )
      if (!res.ok) throw new Error('Failed to fetch rating')
      const data = await res.json()
      return data.result as UserRating
    },
  })

  // 헤더 설정
  useEffect(() => {
    setHeaderContent(
      <header className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-3 p-2 text-gray-600 hover:text-gray-800"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {profile?.nickname || '프로필'}
        </h1>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [profile?.nickname, setHeaderContent, router])

  // 팔로우/언팔로우
  const followMutation = useMutation({
    mutationFn: async (follow: boolean) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'
      const method = follow ? 'POST' : 'DELETE'
      const res = await fetch(`${backendUrl}/api/v1/members/${userId}/follow`, {
        method,
      })
      if (!res.ok) throw new Error('Failed to update follow status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId, 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  if (profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-4">사용자를 찾을 수 없습니다</p>
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:text-primary-700"
        >
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 프로필 헤더 */}
      <UserProfileHeader
        profile={profile}
        rating={rating}
        onFollowToggle={() => followMutation.mutate(!profile.following)}
        isFollowLoading={followMutation.isPending}
      />

      {/* 액션 버튼들 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <FollowButton
            isFollowing={profile.following}
            isLoading={followMutation.isPending}
            onClick={() => followMutation.mutate(!profile.following)}
            size="md"
          />
          <button className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            채팅하기
          </button>
          <Link
            href={`/library/${userId}`}
            className="px-4 py-1.5 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            서재 보기
          </Link>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'library'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            서재
            {activeTab === 'library' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            받은 리뷰
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
            )}
          </button>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'library' ? (
          <div className="p-4">
            <Link
              href={`/library/${userId}`}
              className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {profile.nickname}님의 서재
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    책을 둘러보고 교환을 신청해보세요
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        ) : (
          <div className="p-4">
            {rating && rating.userRatingCount > 0 ? (
              <div className="space-y-3">
                {/* Mock 리뷰 데이터 */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600">5.0</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    약속 시간을 잘 지키고 책도 깨끗하게 관리하시네요!
                  </p>
                  <p className="text-xs text-gray-500 mt-2">2024.01.15</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">아직 받은 리뷰가 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
