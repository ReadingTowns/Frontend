'use client'

import { useRouter } from 'next/navigation'
import ChatList from './ChatList'

export default function MessagesTab() {
  const router = useRouter()

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/social/${conversationId}`)
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatList
        selectedId={null}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  )
}

MessagesTab.displayName = 'MessagesTab'
