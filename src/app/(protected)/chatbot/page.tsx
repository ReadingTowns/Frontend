import { Metadata } from 'next'
import ChatbotPageClient from './ChatbotPageClient'

export const metadata: Metadata = {
  title: 'AI 챗봇 | 리딩타운',
  description: 'AI 챗봇과 대화하세요',
}

export default function ChatbotPage() {
  return <ChatbotPageClient />
}
