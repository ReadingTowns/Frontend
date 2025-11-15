'use client'

/**
 * ConfirmCreateStep Component
 * Step 3: 확인 및 채팅방/교환요청 생성
 */

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createChatRoom,
  createExchangeRequest,
  getChatRoomList,
} from '@/services/chatRoomService'
import { useMyBookhouse } from '@/hooks/useBookhouse'
import type { BookSearchResult, BookhouseOwner } from '@/types/exchange'
import type { CreateChatRoomRequest } from '@/types/chatroom'

interface ConfirmCreateStepProps {
  selectedBook: BookSearchResult
  selectedOwner: BookhouseOwner
  onBack: () => void
}

export function ConfirmCreateStep({
  selectedBook,
  selectedOwner,
  onBack,
}: ConfirmCreateStepProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedMyBook, setSelectedMyBook] = useState<BookSearchResult | null>(
    null
  )

  // 내 서재 책 목록 조회
  const { data: myBooks, isLoading: isLoadingMyBooks } = useMyBookhouse({
    page: 0,
    size: 50,
  })

  // 채팅방 생성 mutation
  const createChatRoomMutation = useMutation({
    mutationFn: async (data: CreateChatRoomRequest) => {
      // 1. 기존 채팅방 목록 조회
      const existingRooms = await getChatRoomList()

      // 2. 동일 유저와의 채팅방이 있는지 확인
      // ChatRoomListItem에는 partnerId가 없으므로 partnerName으로 비교
      const existingRoom = existingRooms.find(
        room => room.partnerName === selectedOwner.memberName
      )

      // 3. 채팅방이 이미 있으면 해당 채팅방 ID 반환
      if (existingRoom) {
        return { chatroomId: existingRoom.chatroomId, isNew: false }
      }

      // 4. 채팅방이 없으면 새로 생성
      const response = await createChatRoom(data)
      return { chatroomId: response.chatroomId, isNew: true }
    },
    onSuccess: async data => {
      // 채팅방이 새로 생성된 경우에만 교환 요청 생성
      if (data.isNew) {
        try {
          await createExchangeRequest({
            chatroomId: data.chatroomId,
            bookhouseId: selectedOwner.bookhouseId,
          })
        } catch (error) {
          console.error('Failed to create exchange request:', error)
          // 교환 요청 실패해도 채팅방은 생성되었으므로 계속 진행
        }
      }

      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['chatrooms'] })

      // 채팅방으로 이동
      router.push(`/chat/${data.chatroomId}`)
    },
    onError: error => {
      console.error('Failed to create chatroom:', error)
      // API 에러는 api.ts에서 자동으로 토스트 표시
    },
  })

  const handleCreate = () => {
    if (!selectedMyBook) {
      toast('교환할 내 책을 선택해주세요', { icon: '⚠️' })
      return
    }

    createChatRoomMutation.mutate({
      memberId: selectedOwner.memberId,
      bookId: selectedMyBook.bookId,
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={createChatRoomMutation.isPending}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">교환 확인</h2>
        </div>
        <p className="text-sm text-gray-500">
          교환할 책을 선택하고 확인해주세요
        </p>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상대방 정보 */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-gray-500 mb-2">교환 상대</p>
          <div className="flex gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              {selectedOwner.profileImage ? (
                <Image
                  src={selectedOwner.profileImage}
                  alt={selectedOwner.memberName}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {selectedOwner.memberName}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < Math.floor(selectedOwner.starRating)
                  return filled ? (
                    <StarIconSolid
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                    />
                  ) : (
                    <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                  )
                })}
                <span className="text-xs text-gray-500 ml-1">
                  {selectedOwner.starRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 상대방 책 */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-gray-500 mb-2">상대방이 가진 책</p>
          <div className="flex gap-3">
            <div className="relative w-12 h-16 flex-shrink-0">
              {selectedBook.bookImage ? (
                <Image
                  src={selectedBook.bookImage}
                  alt={selectedBook.bookName}
                  fill
                  className="object-cover rounded shadow-sm"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">📖</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {selectedBook.bookName}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {selectedBook.author}
              </p>
            </div>
          </div>
        </div>

        {/* 내 책 선택 */}
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 mb-2">교환할 내 책 선택</p>
          {isLoadingMyBooks ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400" />
            </div>
          ) : !myBooks || myBooks.content.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">등록된 책이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myBooks.content.map(book => (
                <button
                  key={book.bookId}
                  onClick={() => setSelectedMyBook(book)}
                  className={`w-full px-3 py-2 flex gap-3 rounded-lg border transition-all
                    ${
                      selectedMyBook?.bookId === book.bookId
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="relative w-10 h-14 flex-shrink-0">
                    {book.bookImage ? (
                      <Image
                        src={book.bookImage}
                        alt={book.bookName}
                        fill
                        className="object-cover rounded shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">📖</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {book.bookName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {book.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={handleCreate}
          disabled={!selectedMyBook || createChatRoomMutation.isPending}
          className="w-full px-4 py-3 bg-primary-400 hover:bg-primary-500
                   text-white rounded-lg font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {createChatRoomMutation.isPending ? '생성 중...' : '교환 요청하기'}
        </button>
      </div>
    </div>
  )
}

ConfirmCreateStep.displayName = 'ConfirmCreateStep'
