'use client'

import { SparklesIcon } from '@heroicons/react/24/solid'

export function ChatbotTypingIndicator() {
  return (
    <div className="mb-4 flex items-start gap-2">
      {/* Avatar placeholder for chatbot */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-400 text-white text-sm">
        <SparklesIcon className="h-5 w-5" />
      </div>

      {/* Typing bubble */}
      <div className="max-w-[70%] rounded-2xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">챗봇이 답변 중입니다</span>
          <div className="flex gap-1">
            <span className="animate-bounce animation-delay-0 text-primary-400">
              .
            </span>
            <span className="animate-bounce animation-delay-150 text-primary-400">
              .
            </span>
            <span className="animate-bounce animation-delay-300 text-primary-400">
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

ChatbotTypingIndicator.displayName = 'ChatbotTypingIndicator'
