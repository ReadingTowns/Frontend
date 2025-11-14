import { useMutation, useQueryClient } from '@tanstack/react-query'
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

interface SendMessageRequest {
  message: string
}

export function useSendChatbotMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: string) => {
      const data = await api.post<ChatbotMessage>('/api/v1/chatbot/chat', {
        message,
      } satisfies SendMessageRequest)
      return data
    },
    onMutate: async message => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chatbot', 'history'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['chatbot', 'history'])

      // Optimistically add user message
      queryClient.setQueryData(
        ['chatbot', 'history'],
        (old: {
          pages: Array<{
            messages: ChatbotMessage[]
            hasMore: boolean
            nextBeforeId: number | null
          }>
          pageParams: unknown[]
        }) => {
          if (!old) return old

          const newUserMessage: ChatbotMessage = {
            messageId: Date.now(), // Temporary ID
            message,
            role: 'USER',
            createdAt: new Date().toISOString(),
            showDate: null,
            dateLabel: null,
            showTime: null,
            timeLabel: null,
          }

          return {
            ...old,
            pages: old.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    messages: [newUserMessage, ...page.messages],
                  }
                : page
            ),
          }
        }
      )

      return { previousData }
    },
    onSuccess: botResponse => {
      // Add bot response to cache
      queryClient.setQueryData(
        ['chatbot', 'history'],
        (old: {
          pages: Array<{
            messages: ChatbotMessage[]
            hasMore: boolean
            nextBeforeId: number | null
          }>
          pageParams: unknown[]
        }) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    messages: [botResponse, ...page.messages],
                  }
                : page
            ),
          }
        }
      )
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['chatbot', 'history'], context.previousData)
      }
      console.error('Failed to send message:', error)
    },
  })
}
