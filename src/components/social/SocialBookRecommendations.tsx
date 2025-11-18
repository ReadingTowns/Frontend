'use client'

/**
 * SocialBookRecommendations Component
 * 소셜 탭 전용 책 추천 컴포넌트 (책 교환용)
 * - BookRecommendations 컴포넌트를 래핑하여 소셜 맥락에 맞는 제목과 메시지 제공
 */

import BookRecommendations from '@/components/recommendations/BookRecommendations'

export default function SocialBookRecommendations() {
  return (
    <BookRecommendations
      title="📚 추천 도서"
      description="이런 책들은 어떠세요? 교환 요청해보세요!"
    />
  )
}

SocialBookRecommendations.displayName = 'SocialBookRecommendations'
