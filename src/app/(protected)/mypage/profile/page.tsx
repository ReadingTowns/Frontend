import { Metadata } from 'next'
import ProfileEditClient from './ProfileEditClient'

export const metadata: Metadata = {
  title: '프로필 수정 - 리딩타운',
  description: '프로필 정보를 수정합니다',
}

export default function ProfileEditPage() {
  return <ProfileEditClient />
}
