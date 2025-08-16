import HomePageClient from './HomePageClient'
import type {
  ExchangeApiResponse,
  UserRecommendationApiResponse,
  BookRecommendationApiResponse,
} from '@/types/dashboard'

async function fetchDashboardData() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const [currentExchangeRes, recommendedUsersRes, recommendedBooksRes] =
      await Promise.all([
        fetch(`${baseUrl}/api/v1/members/me/exchanges`, {
          headers: {
            Cookie: 'access_token=mock_access_token', // SSR에서 쿠키 기반 인증
          },
        }),
        fetch(`${baseUrl}/api/v1/users/recommendations`, {
          headers: {
            Cookie: 'access_token=mock_access_token',
          },
        }),
        fetch(`${baseUrl}/api/v1/books/recommendations`, {
          headers: {
            Cookie: 'access_token=mock_access_token',
          },
        }),
      ])

    const currentExchange: ExchangeApiResponse = currentExchangeRes.ok
      ? await currentExchangeRes.json()
      : { result: null }
    const recommendedUsers: UserRecommendationApiResponse =
      recommendedUsersRes.ok ? await recommendedUsersRes.json() : { result: [] }
    const recommendedBooks: BookRecommendationApiResponse =
      recommendedBooksRes.ok ? await recommendedBooksRes.json() : { result: [] }

    return {
      currentExchange: currentExchange.result,
      recommendedUsers: recommendedUsers.result,
      recommendedBooks: recommendedBooks.result,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return {
      currentExchange: null,
      recommendedUsers: [],
      recommendedBooks: [],
    }
  }
}

export default async function HomePage() {
  const initialData = await fetchDashboardData()

  return <HomePageClient initialData={initialData} />
}
