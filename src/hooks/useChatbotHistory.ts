import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface ChatbotMessage {
  messageId: number
  message: string
  role: 'USER' | 'BOT'
  createdAt: string
  showDate: boolean | null
  dateLabel: string | null
  showTime: boolean | null
  timeLabel: string | null
}

interface ChatbotHistoryResponse {
  messages: ChatbotMessage[]
  hasMore: boolean
  nextBeforeId: number | null
}

export function useChatbotHistory() {
  return useInfiniteQuery({
    queryKey: ['chatbot', 'history'],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const params: Record<string, string | number> = { limit: 30 }
      if (pageParam) {
        params.beforeId = pageParam
      }

      const data = await api.get<ChatbotHistoryResponse>(
        '/api/v1/chatbot/history',
        params
      )
      return data
    },
    getNextPageParam: lastPage => {
      return lastPage.hasMore ? lastPage.nextBeforeId : undefined
    },
    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
