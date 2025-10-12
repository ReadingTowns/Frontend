'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import FollowButton from './FollowButton'
import LibraryButton from './LibraryButton'

interface User {
  memberId?: number
  id?: number
  nickname: string
  profileImage: string
  followed?: boolean
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
  const userId = user.memberId || user.id || 0
  const [isFollowing, setIsFollowing] = useState(
    user.followed ?? user.isFollowing ?? false
  )

  // Sync local state when user prop changes (after refetch)
  useEffect(() => {
    setIsFollowing(user.followed ?? user.isFollowing ?? false)
  }, [user.followed, user.isFollowing])

  // 팔로우/언팔로우 Mutation
  const followMutation = useMutation({
    mutationFn: async (follow: boolean) => {
      if (follow) {
        return await api.post(`/api/v1/members/${userId}/follow`)
      } else {
        return await api.delete(`/api/v1/members/${userId}/follow`)
      }
    },
    onMutate: async follow => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: ['users'] })

      // Optimistically update all user lists
      queryClient.setQueriesData<User[]>({ queryKey: ['users'] }, old => {
        if (!old) return old
        return old.map(u =>
          u.memberId === userId || u.id === userId
            ? { ...u, followed: follow, isFollowing: follow }
            : u
        )
      })

      // Update local state
      setIsFollowing(follow)

      return { previousData }
    },
    onError: (_error, _follow, context) => {
      // Rollback to previous data on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      // Rollback local state
      setIsFollowing(!isFollowing)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
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
      href={`/neighbors/${userId}`}
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
