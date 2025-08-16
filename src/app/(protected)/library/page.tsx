import LibraryPageClient from './LibraryPageClient'
import type { LibraryBook } from '@/types/library'

async function fetchLibraryBooks() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/bookhouse/members/me?page=0&size=10`,
      {
        headers: {
          Cookie: 'access_token=mock_access_token', // SSR에서 쿠키 기반 인증
        },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch library books:', response.status)
      return []
    }

    const data = await response.json()
    return data.result?.content || []
  } catch (error) {
    console.error('Failed to fetch library books:', error)
    return []
  }
}

export default async function LibraryPage() {
  const initialBooks: LibraryBook[] = await fetchLibraryBooks()

  return <LibraryPageClient initialBooks={initialBooks} />
}
