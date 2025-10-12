'use client'

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

interface ProfileSectionProps {
  profile: UserProfile
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const defaultProfileImage = '/default-avatar.svg'

  const renderStars = (rating: number = 0) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ☆
          </span>
        )
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ☆
          </span>
        )
      }
    }
    return stars
  }

  return (
    <div className="bg-white p-6">
      <div className="flex flex-col items-center">
        {/* 프로필 이미지 */}
        <div className="relative w-24 h-24 mb-4">
          <img
            src={profile.profileImage || defaultProfileImage}
            alt={profile.nickname}
            className="w-full h-full rounded-full object-cover bg-gray-100"
            onError={e => {
              const target = e.target as HTMLImageElement
              target.src = defaultProfileImage
            }}
          />
        </div>

        {/* 닉네임 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {profile.nickname}
        </h2>

        {/* 별점 */}
        {profile.userRating !== undefined && profile.userRating !== null && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex">{renderStars(profile.userRating)}</div>
            <span className="text-sm text-gray-600 ml-1">
              {profile.userRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* 후기 수 */}
        <p className="text-sm text-gray-500 mb-4">
          받은 후기 {profile.userRatingCount}개
        </p>

        {/* 추가 정보 */}
        <div className="w-full space-y-2 px-4">
          {profile.currentTown && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">동네</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.currentTown}
              </span>
            </div>
          )}

          {profile.phoneNumber && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">연락처</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.phoneNumber.replace(
                  /(\d{3})(\d{4})(\d{4})/,
                  '$1-$2-$3'
                )}
              </span>
            </div>
          )}

          {profile.availableTime && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">교환 가능 시간</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.availableTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
