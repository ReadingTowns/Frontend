import { Metadata } from 'next'
import ChatRoomClient from './ChatRoomClient'

export const metadata: Metadata = {
  title: '채팅 - 리딩타운',
  description: '책 교환 대화',
}

interface ChatRoomPageProps {
  params: Promise<{
    conversationId: string
  }>
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { conversationId } = await params
  return <ChatRoomClient conversationId={conversationId} />
}
