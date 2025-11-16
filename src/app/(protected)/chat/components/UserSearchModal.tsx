'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  XCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Modal } from '@/components/common/Modal'
import { SearchInput } from '@/components/common/SearchInput'
import UserResultCard from './UserResultCard'
import { searchUsers, createChatRoom } from '@/services/userSearchService'
import type { SearchUser, CreateChatRequest } from '@/types/userSearch'

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserSearchModal({
  isOpen,
  onClose,
}: UserSearchModalProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search users query
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['userSearch', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000, // 30 seconds cache
  })

  // Create chat mutation
  const createChatMutation = useMutation({
    mutationFn: createChatRoom,
    onSuccess: result => {
      // Invalidate chat list to refresh conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      // Navigate to the new chat room
      router.push(`/chat/${result.chatroomId}`)
      onClose()
    },
    onError: () => {
      // API 에러는 api.ts에서 자동으로 토스트 표시
    },
  })

  const handleUserSelect = useCallback(
    (user: SearchUser) => {
      setSelectedUser(user)

      // Create chat room with just the partner (no book selection for now)
      const request: CreateChatRequest = {
        partnerId: user.memberId,
        initialMessage: `안녕하세요! ${user.nickname}님과 책에 대해 이야기하고 싶습니다.`,
      }

      createChatMutation.mutate(request)
    },
    [createChatMutation]
  )

  const handleClose = useCallback(() => {
    setSearchQuery('')
    setDebouncedQuery('')
    setSelectedUser(null)
    onClose()
  }, [onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="사용자 검색"
      closeOnBackdropClick={true}
      closeOnEsc={!createChatMutation.isPending}
      size="md"
      className="max-h-[80vh] flex flex-col"
    >
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="닉네임으로 사용자 검색..."
          isLoading={isSearching}
          autoFocus={true}
        />
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="text-sm text-gray-500 mt-2">
            최소 2글자 이상 입력해주세요
          </p>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {debouncedQuery.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              사용자 검색
            </h3>
            <p className="text-sm text-gray-600 text-center">
              새로운 이웃과 책 교환 대화를 시작해보세요
            </p>
          </div>
        ) : isSearching ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ClockIcon className="w-12 h-12 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600">검색 중...</p>
          </div>
        ) : searchError ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-600 text-center">
              검색 중 오류가 발생했습니다
            </p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['userSearch', debouncedQuery],
                })
              }
              className="mt-4 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <UserGroupIcon className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과 없음
            </h3>
            <p className="text-sm text-gray-600 text-center">
              &apos;{debouncedQuery}&apos;로 검색한 사용자가 없습니다
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {searchResults.map(user => (
              <UserResultCard
                key={user.memberId}
                user={user}
                onSelect={handleUserSelect}
                isLoading={
                  createChatMutation.isPending &&
                  selectedUser?.memberId === user.memberId
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          대화 시작 시 상대방에게 알림이 전송됩니다
        </p>
      </div>
    </Modal>
  )
}
