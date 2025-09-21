'use client'

interface FollowButtonProps {
  isFollowing: boolean
  isLoading?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function FollowButton({
  isFollowing,
  isLoading = false,
  onClick,
  size = 'md',
}: FollowButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-primary-400 text-white hover:bg-primary-500'
        }
        font-medium rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        min-w-[70px]
      `}
    >
      {isLoading ? (
        <span className="inline-block animate-pulse">...</span>
      ) : isFollowing ? (
        '팔로잉'
      ) : (
        '팔로우'
      )}
    </button>
  )
}
