import type {
  SearchUser,
  CreateChatRequest,
  CreateChatApiResponse,
} from '@/types/userSearch'
import { api } from '@/lib/api'

export async function searchUsers(nickname: string): Promise<SearchUser[]> {
  if (nickname.length < 2) {
    return []
  }

  try {
    return await api.get<SearchUser[]>('/api/v1/members/search', { nickname })
  } catch (error) {
    console.error('User search error:', error)
    throw error
  }
}

export async function createChatRoom(
  request: CreateChatRequest
): Promise<CreateChatApiResponse['result']> {
  try {
    return await api.post<CreateChatApiResponse['result']>(
      '/api/v1/chatrooms',
      request
    )
  } catch (error) {
    console.error('Chat creation error:', error)
    throw error
  }
}
