import { Metadata } from 'next'
import ChatClient from './ChatClient'

export const metadata: Metadata = {
  title: '채팅 - 리딩타운',
  description: '이웃과의 책 교환 대화',
}

export default function ChatPage() {
  return <ChatClient />
}
