import { Metadata } from 'next'
import ChatRoomClient from './ChatRoomClient'

export const metadata: Metadata = {
  title: '채팅 - 리딩타운',
  description: '책 교환 대화',
}

interface ChatRoomPageProps {
  params: {
    conversationId: string
  }
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return <ChatRoomClient conversationId={params.conversationId} />
}
