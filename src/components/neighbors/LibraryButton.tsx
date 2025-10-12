'use client'

interface LibraryButtonProps {
  onClick?: () => void
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function LibraryButton({
  onClick,
  isLoading = false,
  size = 'md',
}: LibraryButtonProps) {
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
        bg-primary-400 text-white hover:bg-primary-500
        font-medium rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        min-w-[70px]
      `}
    >
      {isLoading ? (
        <span className="inline-block animate-pulse">...</span>
      ) : (
        '서재 보기'
      )}
    </button>
  )
}
