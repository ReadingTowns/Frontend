import type {
  SearchUser,
  CreateChatRequest,
  UserSearchResponse,
  CreateChatApiResponse,
} from '@/types/userSearch'

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.readingtown.site'

export async function searchUsers(nickname: string): Promise<SearchUser[]> {
  if (nickname.length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/members/search?nickname=${encodeURIComponent(nickname)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    const data: UserSearchResponse = await response.json()

    if (data.code !== '1000') {
      throw new Error(data.message || 'Search failed')
    }

    return data.result
  } catch (error) {
    console.error('User search error:', error)
    throw error
  }
}

export async function createChatRoom(
  request: CreateChatRequest
): Promise<CreateChatApiResponse['result']> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/chatrooms`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Chat creation failed: ${response.status}`)
    }

    const data: CreateChatApiResponse = await response.json()

    if (data.code !== '1000') {
      throw new Error(data.message || 'Chat creation failed')
    }

    return data.result
  } catch (error) {
    console.error('Chat creation error:', error)
    throw error
  }
}
