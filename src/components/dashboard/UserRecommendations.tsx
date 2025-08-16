interface RecommendedUser {
  id: number
  nickname: string
  profileImage?: string
  similarityScore: number
  location: string
  isFollowing?: boolean
}

interface UserRecommendationsProps {
  users?: RecommendedUser[]
  isLoading?: boolean
}

export default function UserRecommendations({
  users = [],
  isLoading,
}: UserRecommendationsProps) {
  const handleFollowClick = (userId: number) => {
    // TODO: 팔로우 기능 구현
    console.log('팔로우:', userId)
  }

  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">추천 이웃</h2>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (users.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">추천 이웃</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <p>추천할 이웃이 없어요</p>
            <p className="text-sm mt-1">더 많은 활동으로 이웃을 찾아보세요!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">추천 이웃</h2>
      <div className="space-y-3">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full overflow-hidden">
                {user.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage}
                    alt={`${user.nickname} 프로필`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg">
                    👤
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{user.nickname}</h4>
                <p className="text-sm text-gray-500">
                  취향 유사도 {user.similarityScore}% · {user.location}
                </p>
              </div>
              <button
                onClick={() => handleFollowClick(user.id)}
                className={`text-sm font-medium px-3 py-1 rounded transition-colors ${
                  user.isFollowing
                    ? 'text-gray-500 border border-gray-300 hover:bg-gray-50'
                    : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
