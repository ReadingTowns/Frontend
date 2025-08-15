'use client'

import { GoogleLoginButton, KakaoLoginButton } from '@/components/auth/SocialLoginButtons'

export default function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.assign('/oauth2/authorization/google')
  }

  const handleKakaoLogin = () => {
    window.location.assign('/oauth2/authorization/kakao')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          리딩타운
        </h1>
        <p className="text-gray-600">
          책으로 이웃과 연결되는 공간
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <GoogleLoginButton onClick={handleGoogleLogin} />
        <KakaoLoginButton onClick={handleKakaoLogin} />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          로그인하여 리딩타운의 모든 서비스를 이용하세요
        </p>
      </div>
    </div>
  )
}