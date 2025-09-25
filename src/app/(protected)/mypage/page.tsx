import { Metadata } from 'next'
import MypageClient from './MypageClient'

export const metadata: Metadata = {
  title: '마이페이지 - 리딩타운',
  description: '프로필 관리 및 설정',
}

export default function MyPage() {
  return <MypageClient />
}
