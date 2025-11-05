// Social tab types and interfaces

export type SocialTab =
  | 'messages'
  | 'following'
  | 'followers'
  | 'explore'
  | 'exchange'

export interface SocialUser {
  memberId: string
  nickname: string
  profileImage?: string
  town: string
  rating: number
  exchangeCount: number
  isFollowing?: boolean
  distance?: string
  commonInterests?: string[]
}

// Query keys for TanStack Query
export const socialKeys = {
  all: ['social'] as const,
  conversations: () => [...socialKeys.all, 'conversations'] as const,
  messages: (id: string) => [...socialKeys.all, 'messages', id] as const,
  following: () => [...socialKeys.all, 'following'] as const,
  followers: () => [...socialKeys.all, 'followers'] as const,
  recommendations: () => [...socialKeys.all, 'recommendations'] as const,
  search: (query: string) => [...socialKeys.all, 'search', query] as const,
}
