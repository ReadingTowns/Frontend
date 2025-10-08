export interface SearchUser {
  memberId: string
  nickname: string
  profileImage?: string
  town: string
  rating: number
  exchangeCount: number
  isFollowing?: boolean
}

export interface CreateChatRequest {
  partnerId: string
  myBookId?: string
  partnerBookId?: string
  initialMessage?: string
}

export interface CreateChatResponse {
  chatroomId: string
  partnerId: string
  partnerName: string
  bookTitle?: string
}

export interface UserSearchResponse {
  code: string
  message: string
  result: SearchUser[]
}

export interface CreateChatApiResponse {
  code: string
  message: string
  result: CreateChatResponse
}
