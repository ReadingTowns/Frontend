'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { BookOpenIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import Image from 'next/image'
import {
  HEADER_HEIGHT,
  HEADER_STYLES,
  ProgressHeaderConfig,
  NavigationHeaderConfig,
  ActionHeaderConfig,
  ChatHeaderConfig,
} from '@/types/header'
import ProgressHeader from './ProgressHeader'

/**
 * CommonHeader Component
 * HeaderContext의 설정을 읽어 적절한 헤더를 렌더링하는 통합 헤더 컴포넌트
 */
export default function CommonHeader() {
  const router = useRouter()
  const { headerConfig } = useHeader()

  // 헤더 설정이 없으면 렌더링하지 않음
  if (!headerConfig) {
    return null
  }

  // Progress 헤더는 기존 컴포넌트 재사용
  if (headerConfig.variant === 'progress') {
    const progressConfig = headerConfig as ProgressHeaderConfig
    return (
      <ProgressHeader
        title={progressConfig.title}
        currentStep={progressConfig.currentStep}
        totalSteps={progressConfig.totalSteps}
      />
    )
  }

  // 높이 계산
  const height = headerConfig.subtitle
    ? HEADER_HEIGHT.withSubtitle
    : HEADER_HEIGHT.default

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (
      headerConfig.variant === 'navigation' ||
      headerConfig.variant === 'action' ||
      headerConfig.variant === 'chat'
    ) {
      const navConfig = headerConfig as
        | NavigationHeaderConfig
        | ActionHeaderConfig
        | ChatHeaderConfig
      if (navConfig.onBack) {
        navConfig.onBack()
      } else {
        router.back()
      }
    }
  }

  // 뒤로가기 버튼 표시 여부
  const showBackButton =
    headerConfig.variant === 'navigation' ||
    headerConfig.variant === 'action' ||
    headerConfig.variant === 'chat'

  return (
    <header
      className={`${
        headerConfig.transparent
          ? HEADER_STYLES.transparent
          : HEADER_STYLES.base
      } ${headerConfig.className || ''}`}
      style={{ height }}
    >
      <div className={`${HEADER_STYLES.container} h-full`}>
        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button
            onClick={handleBack}
            className={HEADER_STYLES.backButton}
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        )}

        {/* 채팅 헤더 특수 처리 */}
        {headerConfig.variant === 'chat' ? (
          <>
            {(() => {
              const chatConfig = headerConfig as ChatHeaderConfig
              return (
                <>
                  <div className="flex-1 min-w-0">
                    <h1 className={HEADER_STYLES.title}>
                      {chatConfig.partner.nickname}
                    </h1>
                    {chatConfig.bookInfo && (
                      <p className="text-xs text-primary-600 flex items-center gap-1 mt-0.5">
                        <BookOpenIcon className="w-3 h-3" />
                        {chatConfig.bookInfo.bookName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {/* WebSocket 연결 상태 */}
                    {chatConfig.isConnected !== undefined && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            chatConfig.isConnected
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                          title={
                            chatConfig.isConnected ? '연결됨' : '연결 끊김'
                          }
                        />
                        <span className="text-xs text-gray-500">
                          {chatConfig.isConnected ? '실시간' : '오프라인'}
                        </span>
                      </div>
                    )}
                    {/* 액션 버튼들 */}
                    {chatConfig.actions && (
                      <div className="flex items-center">
                        {chatConfig.actions}
                      </div>
                    )}
                  </div>
                </>
              )
            })()}
          </>
        ) : (
          <>
            {/* 일반 헤더 콘텐츠 */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {/* basic 헤더일 때만 로고 표시 - Next.js Image 컴포넌트로 최적화 */}
              {headerConfig.variant === 'basic' &&
                headerConfig.title === '리딩타운' && (
                  <div className="relative w-7 h-7 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="리딩타운 로고"
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </div>
                )}
              <div>
                {headerConfig.title && (
                  <h1 className={HEADER_STYLES.title}>{headerConfig.title}</h1>
                )}
                {headerConfig.subtitle && (
                  <p className={`${HEADER_STYLES.subtitle} mt-0.5`}>
                    {headerConfig.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* 액션 버튼들 */}
            {headerConfig.variant === 'action' && (
              <div className="flex items-center gap-2">
                {(headerConfig as ActionHeaderConfig).actions}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
