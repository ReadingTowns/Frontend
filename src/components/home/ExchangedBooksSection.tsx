'use client'

import { useRouter } from 'next/navigation'
import { ExchangedBook } from '@/types/home'
import { BookCard } from '@/components/books/BookCard'
import { GridBook } from '@/types/bookCard'
import { useSnackbar } from '@/contexts/SnackbarContext'

interface ExchangedBooksSectionProps {
  books: ExchangedBook[]
  isLoading?: boolean
}

/**
 * 교환한 도서 섹션 컴포넌트
 * - 최근 교환한 도서 3권 표시
 * - 책 표지, 제목, 교환 상대 닉네임, 교환 날짜 표시
 * - chatRoomId가 있으면 채팅방으로 이동, 없으면 안내 메시지 표시
 */
export default function ExchangedBooksSection({
  books,
  isLoading,
}: ExchangedBooksSectionProps) {
  const router = useRouter()
  const { showInfo } = useSnackbar()

  const handleBookClick = (book: ExchangedBook) => {
    if (book.chatRoomId) {
      router.push(`/chat/${book.chatRoomId}`)
    } else {
      showInfo('채팅방이 생성되면 이동할 수 있습니다')
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-1" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500 text-sm">아직 교환한 도서가 없습니다</p>
      </div>
    )
  }

  // 최근 3권만 표시
  const displayBooks = books.slice(0, 3)

  return (
    <div className="grid grid-cols-3 gap-4">
      {displayBooks.map(book => (
        <BookCard
          key={book.exchangeId}
          variant="grid"
          book={
            {
              bookId: book.exchangeId,
              bookTitle: book.bookTitle,
              bookCoverImage: book.bookCoverImage,
              author: '',
              partnerNickname: book.partnerNickname,
            } as GridBook
          }
          onClick={() => handleBookClick(book)}
          columns={3}
          compact={true}
          aspectRatio="3/4"
          showPartner={true}
        />
      ))}
    </div>
  )
}

ExchangedBooksSection.displayName = 'ExchangedBooksSection'
