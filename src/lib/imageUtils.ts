/**
 * Image URL Utility Functions
 * Next.js Image 컴포넌트용 URL 변환 유틸리티
 */

/**
 * S3 Base URL
 * Next.js Image의 remotePatterns에 설정된 도메인
 */
const S3_BASE_URL = 'https://readingtown.s3.ap-northeast-2.amazonaws.com'

/**
 * 상대 경로 이미지 URL을 절대 URL로 변환
 *
 * @param imageUrl - 이미지 URL (절대/상대 경로 또는 null)
 * @returns 절대 URL 또는 null
 *
 * @example
 * getAbsoluteImageUrl('profile8.jpg')
 * // Returns: 'https://readingtown.s3.ap-northeast-2.amazonaws.com/profile8.jpg'
 *
 * getAbsoluteImageUrl('https://example.com/image.jpg')
 * // Returns: 'https://example.com/image.jpg'
 *
 * getAbsoluteImageUrl(null)
 * // Returns: null
 */
export function getAbsoluteImageUrl(imageUrl: string | null): string | null {
  // null이면 null 반환
  if (!imageUrl) {
    return null
  }

  // 이미 절대 URL이면 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // 상대 경로면 S3 base URL 추가
  // 슬래시로 시작하면 제거 (중복 방지)
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl

  return `${S3_BASE_URL}/${cleanPath}`
}

/**
 * 기본 프로필 이미지 URL
 */
export const DEFAULT_PROFILE_IMAGE = '/images/default-avatar.png'

/**
 * 기본 책 표지 이미지 URL
 */
export const DEFAULT_BOOK_COVER = '/images/default-book.png'
