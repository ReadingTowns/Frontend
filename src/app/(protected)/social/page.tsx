import { Metadata } from 'next'
import { Suspense } from 'react'
import SocialClient from './SocialClient'

export const metadata: Metadata = {
  title: '소셜 - 리딩타운',
  description: '이웃과 책 이야기를 나누세요',
}

export default function SocialPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SocialClient />
    </Suspense>
  )
}
