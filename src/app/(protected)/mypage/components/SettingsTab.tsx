import { useRouter } from 'next/navigation'
import {
  UserIcon,
  MapPinIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
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
      icon: <UserIcon className="w-6 h-6" />,
      onClick: () => router.push('/mypage/profile'),
    },
    {
      id: 'town',
      title: '동네 설정',
      icon: <MapPinIcon className="w-6 h-6" />,
      onClick: () => router.push('/mypage/town'),
    },
    {
      id: 'about',
      title: '앱 정보',
      icon: <InformationCircleIcon className="w-6 h-6" />,
      onClick: () => router.push('/mypage/about'),
    },
    {
      id: 'logout',
      title: '로그아웃',
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      onClick: onShowLogout,
      isDanger: true,
    },
  ]

  return <MenuList items={menuItems} />
}
