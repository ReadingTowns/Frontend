import { Metadata } from 'next'
import UserProfileClient from './UserProfileClient'

interface Props {
  params: Promise<{
    userId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params // params를 await 처리
  return {
    title: `프로필 - 리딩타운`,
    description: '이웃의 프로필과 서재를 확인해보세요',
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params
  return <UserProfileClient userId={userId} />
}
