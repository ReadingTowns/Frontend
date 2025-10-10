import { useRouter } from 'next/navigation'
import MenuList from './MenuList'

interface SettingsTabProps {
  onShowLogout: () => void
}

export default function SettingsTab({ onShowLogout }: SettingsTabProps) {
  const router = useRouter()

  const menuItems = [
    {
      id: 'profile',
      title: '프로필 수정',
      icon: '👤',
      onClick: () => router.push('/mypage/profile'),
    },
    {
      id: 'reading-habit',
      title: '독서 습관 설정',
      icon: '📚',
      onClick: () => router.push('/mypage/reading-habit'),
    },
    {
      id: 'about',
      title: '앱 정보',
      icon: 'ℹ️',
      onClick: () => router.push('/mypage/about'),
    },
    {
      id: 'logout',
      title: '로그아웃',
      icon: '🚪',
      onClick: onShowLogout,
      isDanger: true,
    },
  ]

  return <MenuList items={menuItems} />
}
