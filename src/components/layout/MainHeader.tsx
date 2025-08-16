'use client'

import { useAuth } from '@/hooks/useAuth'

interface MainHeaderProps {
  title?: string
  subtitle?: string
  showUserGreeting?: boolean
}

export default function MainHeader({
  title = '리딩 타운',
  subtitle = '책으로 연결되는 우리 동네',
  showUserGreeting = true,
}: MainHeaderProps) {
  const { user, logout, isLoggingOut } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-secondary-800 bg-clip-text text-transparent">
          {title}
        </h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
      {subtitle && <p className="text-center text-gray-500 mt-2">{subtitle}</p>}
      {showUserGreeting && user && (
        <p className="text-center text-sm text-gray-400 mt-1">
          안녕하세요, {user.name}님!
        </p>
      )}
    </header>
  )
}
