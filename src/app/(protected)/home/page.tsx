import HomePageClient from './HomePageClient'
import type {
  ExchangeApiResponse,
  UserRecommendationApiResponse,
  BookRecommendationApiResponse,
} from '@/types/dashboard'

async function fetchDashboardData() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

  try {
    const [currentExchangeRes, recommendedUsersRes, recommendedBooksRes] =
      await Promise.all([
        fetch(`${backendUrl}/api/v1/members/me/exchanges`, {
          credentials: 'include',
        }),
        fetch(`${backendUrl}/api/v1/users/recommendations`, {
          credentials: 'include',
        }),
        fetch(`${backendUrl}/api/v1/books/recommendations`, {
          credentials: 'include',
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
