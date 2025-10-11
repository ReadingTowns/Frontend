'use client'

import {
  UserCircleIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import type { SearchUser } from '@/types/userSearch'

interface UserResultCardProps {
  user: SearchUser
  onSelect: (user: SearchUser) => void
  isLoading?: boolean
}

export default function UserResultCard({
  user,
  onSelect,
  isLoading = false,
}: UserResultCardProps) {
  const handleSelect = () => {
    if (!isLoading) {
      onSelect(user)
    }
  }

  const renderStarRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <StarOutlineIcon key="half" className="w-4 h-4 text-yellow-400" />
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <button
        onClick={handleSelect}
        disabled={isLoading}
        className="w-full p-4 text-left focus:outline-none focus:bg-gray-50 disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-7 h-7 text-gray-400" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 truncate">
                {user.nickname}
              </h3>
              {user.isFollowing && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  팔로잉
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 mb-1 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {user.town}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStarRating(user.rating)}
                  <span className="text-gray-600 ml-1">
                    {user.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  교환 {user.exchangeCount}회
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <div className="bg-primary-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
              {isLoading ? (
                <ClockIcon className="w-4 h-4 animate-spin" />
              ) : (
                '대화 시작'
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
