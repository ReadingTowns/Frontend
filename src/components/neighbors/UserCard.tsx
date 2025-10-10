'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FollowButton from './FollowButton'

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
}

export default function UserCard({
  user,
  showFollowButton = false,
}: UserCardProps) {
  const queryClient = useQueryClient()
  const userId = user.memberId || user.id || 0
  const [isFollowing, setIsFollowing] = useState(
    user.followed ?? user.isFollowing ?? false
  )

  // 팔로우/언팔로우 Mutation
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
    onMutate: async follow => {
      // Optimistic Update
      setIsFollowing(follow)
    },
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      // 에러 시 롤백
      setIsFollowing(!isFollowing)
    },
  })

  const handleFollowToggle = () => {
    followMutation.mutate(!isFollowing)
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
        {showFollowButton && (
          <div
            onClick={e => {
              e.preventDefault()
              handleFollowToggle()
            }}
            className="ml-3"
          >
            <FollowButton
              isFollowing={isFollowing}
              isLoading={followMutation.isPending}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
