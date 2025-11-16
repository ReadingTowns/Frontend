'use client'

import { ExchangePair } from '@/types/home'

interface ExchangeCardProps {
  exchange: ExchangePair
  onClick?: () => void
}

/**
 * 교환 카드 컴포넌트
 * - 내 책과 상대방 책을 시각적 위계로 구분하여 표시
 * - 내 책: 큰 크기, 진한 색상으로 강조
 * - 상대방 책: 작은 크기, 옅은 색상으로 보조 정보 표현
 */
export function ExchangeCard({ exchange, onClick }: ExchangeCardProps) {
  const { myBook, partnerBook, chatroomId } = exchange

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[280px] bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-400 hover:shadow-md transition-all duration-200 text-left snap-start"
      type="button"
    >
      {/* 책 표지 영역 */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* 내 책 - 강조 */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={myBook.bookImage}
              alt={myBook.bookName}
              className="w-20 aspect-[2/3] object-cover rounded-md shadow-sm border-2 border-primary-400"
            />
            <div className="absolute -bottom-1 -right-1 bg-primary-400 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              My
            </div>
          </div>
        </div>

        {/* 교환 화살표 */}
        <div className="flex-shrink-0 text-primary-400">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>

        {/* 상대방 책 - 보조 */}
        <div className="flex-shrink-0">
          <img
            src={partnerBook.bookImage}
            alt={partnerBook.bookName}
            className="w-16 aspect-[2/3] object-cover rounded-md shadow-sm opacity-70 border border-gray-200"
          />
        </div>
      </div>

      {/* 책 제목 영역 */}
      <div className="space-y-1">
        {/* 내 책 제목 - 강조 */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
          {myBook.bookName}
        </h3>

        {/* 상대방 책 제목 - 보조 */}
        <p className="font-normal text-xs text-gray-500 line-clamp-1">
          교환: {partnerBook.bookName}
        </p>
      </div>

      {/* 채팅방 상태 표시 */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {chatroomId ? (
          <div className="flex items-center justify-center gap-1 text-xs text-primary-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">채팅방 이동</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>채팅방 생성 대기</span>
          </div>
        )}
      </div>
    </button>
  )
}

ExchangeCard.displayName = 'ExchangeCard'
