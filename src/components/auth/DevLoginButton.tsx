'use client'

interface DevLoginButtonProps {
  onClick: () => void
}

export function DevLoginButton({ onClick }: DevLoginButtonProps) {
  // 환경 변수로 제어 (배포된 개발 서버에서도 사용 가능)
  const showDevLogin = process.env.NEXT_PUBLIC_SHOW_DEV_LOGIN === 'true'

  if (!showDevLogin) {
    return null
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-30"></div>
      <button
        onClick={onClick}
        className="relative w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all text-white font-medium shadow-lg"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>개발자 로그인 (Dev Only)</span>
        <span className="text-xs opacity-75 ml-1">🚀</span>
      </button>
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">⚡ 개발 환경 전용 - 즉시 로그인</p>
      </div>
    </div>
  )
}
