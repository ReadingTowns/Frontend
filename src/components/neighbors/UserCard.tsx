'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSnackbar } from '@/hooks/useSnackbar'
import FollowButton from './FollowButton'
import LibraryButton from './LibraryButton'

interface User {
  memberId?: number
  id?: number
  nickname: string
  profileImage: string
  followed?: boolean
  following?: boolean // 검색 API 응답 필드
  currentTown?: string
  userRating?: number | null
  userRatingCount?: number
  commonInterests?: string[]
  distance?: string
  location?: string
  similarityScore?: number
  isFollowing?: boolean
}

interface UserCardProps {
  user: User
  showFollowButton?: boolean
  showLibraryButton?: boolean
}

export default function UserCard({
  user,
  showFollowButton = false,
  showLibraryButton = false,
}: UserCardProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { showError } = useSnackbar()
  const userId = user.memberId || user.id || 0
  const [isFollowing, setIsFollowing] = useState(
    user.followed ?? user.following ?? user.isFollowing ?? false
  )

  // Sync local state when user prop changes (after refetch)
  useEffect(() => {
    setIsFollowing(user.followed ?? user.following ?? user.isFollowing ?? false)
  }, [user.followed, user.following, user.isFollowing])

  // 팔로우/언팔로우 Mutation (낙관적 업데이트 적용)
  const followMutation = useMutation({
    mutationFn: async (follow: boolean) => {
      if (follow) {
        return await api.post(`/api/v1/members/${userId}/follow`)
      } else {
        return await api.delete(`/api/v1/members/${userId}/follow`)
      }
    },
    onMutate: async follow => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousData = queryClient.getQueriesData({ queryKey: ['users'] })

      // 낙관적 업데이트: 모든 유저 리스트에서 해당 유저의 팔로우 상태 즉시 변경
      queryClient.setQueriesData<User[]>({ queryKey: ['users'] }, old => {
        if (!old) return old
        return old.map(u =>
          u.memberId === userId || u.id === userId
            ? { ...u, followed: follow, following: follow, isFollowing: follow }
            : u
        )
      })

      // 로컬 상태도 즉시 업데이트 (빠른 UI 반응)
      setIsFollowing(follow)

      return { previousData }
    },
    onError: (_error, _follow, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      // 로컬 상태 롤백
      setIsFollowing(!isFollowing)

      // 사용자에게 에러 알림
      showError('팔로우 처리에 실패했습니다. 다시 시도해주세요.')
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터 재조회 (데이터 일관성 보장)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleFollowToggle = () => {
    followMutation.mutate(!isFollowing)
  }

  const handleLibraryClick = () => {
    router.push(`/library/${userId}`)
  }

  return (
    <Link
      href={`/library/${userId}`}
      className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.nickname}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                {user.nickname.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {user.nickname}
            </p>
            {(user.currentTown || user.location) && (
              <p className="text-sm text-gray-500 truncate">
                {user.currentTown || user.location}
                {user.distance && ` · ${user.distance}`}
              </p>
            )}
            {user.userRating !== null && user.userRating !== undefined && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {user.userRating.toFixed(1)}
                  {user.userRatingCount !== undefined &&
                    ` (${user.userRatingCount})`}
                </span>
              </div>
            )}
            {user.commonInterests && user.commonInterests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {user.commonInterests.slice(0, 2).map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
            {user.similarityScore !== undefined && (
              <p className="text-xs text-primary-600 mt-1">
                취향 {user.similarityScore}% 일치
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-3">
          {showLibraryButton && (
            <div
              onClick={e => {
                e.preventDefault()
                handleLibraryClick()
              }}
            >
              <LibraryButton size="sm" />
            </div>
          )}
          {showFollowButton && (
            <div
              onClick={e => {
                e.preventDefault()
                handleFollowToggle()
              }}
            >
              <FollowButton
                isFollowing={isFollowing}
                isLoading={followMutation.isPending}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
