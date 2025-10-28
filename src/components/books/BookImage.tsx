'use client'

import Image from 'next/image'
import { BookOpenIcon } from '@heroicons/react/24/outline'

interface BookImageProps {
  src: string | null
  alt: string
  aspectRatio: '2/3' | '3/4' | 'square'
  fallbackVariant?: 'icon' | 'title'
  title?: string
  size?: 'small' | 'medium' | 'large'
}

/**
 * 책 이미지 공통 컴포넌트
 * - Next.js Image 최적화 적용
 * - 이미지 없을 때 그라데이션 폴백
 * - 아이콘 또는 제목 텍스트 표시
 */
export function BookImage({
  src,
  alt,
  aspectRatio,
  fallbackVariant = 'title',
  title,
  size = 'medium',
}: BookImageProps) {
  const aspectClasses = {
    '2/3': 'aspect-[2/3]',
    '3/4': 'aspect-[3/4]',
    square: 'aspect-square',
  }

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  const textSizes = {
    small: 'text-xs line-clamp-4',
    medium: 'text-sm line-clamp-3',
    large: 'text-base line-clamp-2',
  }

  // 이미지 폴백: 그라데이션 배경
  if (!src) {
    return (
      <div
        className={`${aspectClasses[aspectRatio]} bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center`}
      >
        {fallbackVariant === 'icon' ? (
          <BookOpenIcon className={`${iconSizes[size]} text-white`} />
        ) : (
          <div className="text-center px-2">
            <p className={`text-gray-600 font-medium ${textSizes[size]}`}>
              {title || alt}
            </p>
          </div>
        )}
      </div>
    )
  }

  // 정상 이미지 표시
  return (
    <div
      className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-lg bg-gray-100`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 430px) 33vw, 143px"
      />
    </div>
  )
}

BookImage.displayName = 'BookImage'
