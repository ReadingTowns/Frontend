'use client'

import Link from 'next/link'
import { clsx } from 'clsx'

interface FloatingButtonProps {
  variant: 'primary' | 'secondary' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  text?: string
  onClick?: () => void
  href?: string
  ariaLabel: string
}

export function FloatingButton({
  variant,
  icon: Icon,
  text,
  onClick,
  href,
  ariaLabel,
}: FloatingButtonProps) {
  const baseClasses = clsx(
    // Size and shape
    'w-14 h-14 rounded-full',
    // Layout
    'flex items-center justify-center',
    // Shadow and transitions
    'shadow-lg transition-transform hover:scale-110 active:scale-95',
    // Variant-specific colors
    {
      'bg-primary-400 text-white': variant === 'primary',
      'bg-secondary-200 text-gray-800': variant === 'secondary',
      'bg-gray-200 text-gray-800': variant === 'neutral',
    }
  )

  const buttonContent = (
    <>
      {Icon && <Icon className="h-7 w-7" />}
      {text && !Icon && <span className="text-3xl font-light">{text}</span>}
    </>
  )

  const button = href ? (
    <Link href={href} aria-label={ariaLabel}>
      <button className={baseClasses} aria-label={ariaLabel}>
        {buttonContent}
      </button>
    </Link>
  ) : (
    <button onClick={onClick} className={baseClasses} aria-label={ariaLabel}>
      {buttonContent}
    </button>
  )

  // 아이콘과 텍스트가 모두 있는 경우 라벨을 버튼 위에 말풍선 스타일로 표시
  if (Icon && text) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {/* 말풍선 본체 */}
          <div className="bg-primary-400 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md whitespace-nowrap">
            {text}
          </div>
          {/* 말풍선 화살표 (아래쪽) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-400 rotate-45" />
        </div>
        {button}
      </div>
    )
  }

  return button
}

FloatingButton.displayName = 'FloatingButton'
