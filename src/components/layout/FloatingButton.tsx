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

  const content = (
    <>
      {Icon && <Icon className="h-7 w-7" />}
      {text && <span className="text-3xl font-light">{text}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        <button className={baseClasses} aria-label={ariaLabel}>
          {content}
        </button>
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses} aria-label={ariaLabel}>
      {content}
    </button>
  )
}

FloatingButton.displayName = 'FloatingButton'
