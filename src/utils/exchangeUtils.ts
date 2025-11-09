/**
 * Exchange Utility Functions
 * 교환 요청 관련 유틸리티 함수
 */

import type { ExchangeBooksResponse } from '@/types/chatroom'

/**
 * 교환 요청이 만료되었는지 확인
 *
 * 메시지의 relatedExchangeStatusId가 현재 exchangeBooks에 없으면 만료된 것으로 판단
 *
 * @param relatedExchangeStatusId - 메시지에 연결된 교환 상태 ID
 * @param exchangeBooks - 현재 채팅방의 교환 책 정보
 * @returns true if the exchange is expired, false otherwise
 *
 * @example
 * ```typescript
 * const expired = isExchangeExpired(message.relatedExchangeStatusId, exchangeBooks)
 * if (expired) {
 *   return <ExchangeStatusMessage messageText="만료된 교환 요청" />
 * }
 * ```
 */
export function isExchangeExpired(
  relatedExchangeStatusId: number | null | undefined,
  exchangeBooks?: ExchangeBooksResponse
): boolean {
  // relatedExchangeStatusId가 없거나 exchangeBooks가 없으면 만료된 것이 아님
  if (!relatedExchangeStatusId || !exchangeBooks) {
    return false
  }

  const { myBook, partnerBook } = exchangeBooks

  // myBook이나 partnerBook의 exchangeStatusId와 일치하지 않으면 만료
  return (
    myBook.exchangeStatusId !== relatedExchangeStatusId &&
    partnerBook.exchangeStatusId !== relatedExchangeStatusId
  )
}
