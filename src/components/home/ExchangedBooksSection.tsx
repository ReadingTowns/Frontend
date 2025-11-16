'use client'

import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/toast'
import { ExchangePair } from '@/types/home'
import { ExchangeCard } from './ExchangeCard'

interface ExchangedBooksSectionProps {
  exchanges: ExchangePair[]
  isLoading?: boolean
}

/**
 * 교환한 도서 섹션 컴포넌트
 * - 최근 교환 3건 표시
 * - 교환 단위로 그룹화하여 내 책과 상대방 책을 함께 표시
 * - chatroomId가 있으면 채팅방으로 이동, 없으면 안내 메시지 표시
 */
export default function ExchangedBooksSection({
  exchanges,
  isLoading,
}: ExchangedBooksSectionProps) {
  const router = useRouter()

  const handleExchangeClick = (exchange: ExchangePair) => {
    if (exchange.chatroomId) {
      router.push(`/chat/${exchange.chatroomId}`)
    } else {
      showToast('채팅방이 생성되면 이동할 수 있습니다')
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] animate-pulse bg-gray-200 rounded-lg h-64"
          />
        ))}
      </div>
    )
  }

  if (!exchanges || exchanges.length === 0) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500 text-sm">아직 교환한 도서가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
      {exchanges.map((exchange, index) => (
        <ExchangeCard
          key={`${exchange.myBook.bookhouseId}-${exchange.partnerBook.bookhouseId}-${index}`}
          exchange={exchange}
          onClick={() => handleExchangeClick(exchange)}
        />
      ))}
    </div>
  )
}

ExchangedBooksSection.displayName = 'ExchangedBooksSection'
