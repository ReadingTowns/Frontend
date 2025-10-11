import { BookOpenIcon } from '@heroicons/react/24/outline'

interface ExchangeData {
  chatRoomId: number
  myBook: {
    bookhouseId: number | null
    bookName: string | null
    bookImage: string | null
  }
  yourBook: {
    bookhouseId: number | null
    bookName: string | null
    bookImage: string | null
  }
  daysLeft?: number
}

interface CurrentExchangeProps {
  exchange?: ExchangeData | null
  isLoading?: boolean
}

export default function CurrentExchange({
  exchange,
  isLoading,
}: CurrentExchangeProps) {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">현재 교환</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-24 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!exchange || !exchange.myBook || !exchange.myBook.bookName) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">현재 교환</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center py-8 text-gray-500">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>진행 중인 교환이 없어요</p>
            <p className="text-sm mt-1">
              책방에서 마음에 드는 책을 찾아보세요!
            </p>
          </div>
        </div>
      </section>
    )
  }

  const handleChatClick = () => {
    // TODO: 채팅방으로 이동
    console.log('채팅방으로 이동:', exchange.chatRoomId)
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">현재 교환</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded overflow-hidden">
            {exchange.myBook.bookImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exchange.myBook.bookImage}
                alt={exchange.myBook.bookName || '책 표지'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <BookOpenIcon className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {exchange.myBook.bookName}
            </h3>
            <p className="text-sm text-gray-600">
              {exchange.yourBook.bookName
                ? `→ ${exchange.yourBook.bookName}`
                : '교환 대기 중'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {exchange.daysLeft !== undefined && (
                <>
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                    D-{exchange.daysLeft}
                  </span>
                  <span className="text-sm text-gray-500">반납까지</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleChatClick}
            className="px-4 py-2 bg-primary-400 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
          >
            채팅
          </button>
        </div>
      </div>
    </section>
  )
}
