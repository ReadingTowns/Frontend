'use client'

import ChatList from './ChatList'

export default function MessagesTab() {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatList selectedId={null} onSelectConversation={() => {}} />
    </div>
  )
}

MessagesTab.displayName = 'MessagesTab'
