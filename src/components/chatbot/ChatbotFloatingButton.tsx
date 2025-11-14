'use client'

import { useRouter } from 'next/navigation'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

export function ChatbotFloatingButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/chatbot')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-400 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="AI 챗봇 열기"
    >
      <ChatBubbleLeftRightIcon className="h-7 w-7" />
    </button>
  )
}

ChatbotFloatingButton.displayName = 'ChatbotFloatingButton'
