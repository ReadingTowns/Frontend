'use client'

import Image from 'next/image'

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

interface UserProfileHeaderProps {
  profile: UserProfile
  rating?: UserRating | null
  onFollowToggle?: () => void
  isFollowLoading?: boolean
}

export default function UserProfileHeader({
  profile,
  rating,
}: UserProfileHeaderProps) {
  const displayRating = rating?.userRating || profile.userRating
  const displayRatingCount = rating?.userRatingCount || profile.userRatingCount

  return (
    <div className="bg-white p-6 border-b border-gray-200">
      <div className="flex items-start space-x-4">
        {/* 프로필 이미지 */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {profile.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={profile.nickname}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
              {profile.nickname.charAt(0)}
            </div>
          )}
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {profile.nickname}
          </h2>

          {profile.currentTown && (
            <p className="text-sm text-gray-600 mt-1">
              📍 {profile.currentTown}
            </p>
          )}

          {displayRating !== null && displayRating !== undefined && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 font-medium text-gray-900">
                  {displayRating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({displayRatingCount}명 평가)
                </span>
              </div>
            </div>
          )}

          {profile.availableTime && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">⏰ 교환 가능 시간</p>
              <p className="text-sm font-medium text-gray-900">
                {profile.availableTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
