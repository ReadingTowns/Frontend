'use client'

import { useParams } from 'next/navigation'
import { useUserProfile } from '@/hooks/useLibrary'
import { LibraryBooksGrid } from '@/components/library/LibraryBooksGrid'
import { useAuth } from '@/hooks/useAuth'
import { useCreateChatRoom } from '@/hooks/useChatRoom'
import { useUserRating } from '@/hooks/useUserRating'
import { useSnackbar } from '@/hooks/useSnackbar'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import { useState } from 'react'
import RatingModal from '@/components/user/RatingModal'
import { Modal } from '@/components/common/Modal'
import { ProfileSkeleton } from '@/components/ui/Skeleton'
import {
  UserCircleIcon,
  FaceFrownIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function UserLibraryPage() {
  const params = useParams()
  const userId = params.userId as string
  const { user: currentUser } = useAuth()
  const { showError } = useSnackbar()

  const { data: profile, isLoading: profileLoading } = useUserProfile(userId)
  const { data: userRating } = useUserRating(userId)

  const isOwnLibrary = currentUser?.memberId?.toString() === userId

  // 별점 데이터 우선순위: useUserRating hook > profile 데이터
  const displayRating = userRating?.userRating ?? profile?.userRating
  const displayRatingCount =
    userRating?.userRatingCount ?? profile?.userRatingCount

  // 헤더 설정
  useHeaderConfig(
    {
      variant: 'navigation',
      title: profile ? `${profile.nickname}님의 서재` : '서재',
      subtitle: isOwnLibrary
        ? '나만의 책 컬렉션을 관리해보세요'
        : '이웃의 책 컬렉션을 둘러보세요',
    },
    [profile, isOwnLibrary]
  )

  // 교환 신청 상태 관리
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<{
    bookId: number
    bookhouseId: number
    bookTitle: string
  } | null>(null)

  // 별점 모달 상태 관리
  const [showRatingModal, setShowRatingModal] = useState(false)

  // 교환 신청 (채팅룸 생성) mutation
  const createChatRoomMutation = useCreateChatRoom()

  // 교환 신청 핸들러
  const handleExchangeRequest = (
    bookId: number,
    bookhouseId: number,
    bookTitle: string
  ) => {
    setSelectedBook({ bookId, bookhouseId, bookTitle })
    setShowExchangeModal(true)
  }

  // 교환 신청 확정
  const handleConfirmExchange = () => {
    if (!selectedBook || !profile) return

    createChatRoomMutation.mutate(
      {
        memberId: profile.memberId,
        bookId: selectedBook.bookId,
        bookhouseId: selectedBook.bookhouseId,
      },
      {
        onSuccess: data => {
          setShowExchangeModal(false)
          // 채팅방으로 이동 - 개발 환경 URL 사용
          window.location.href = `https://dev.readingtown.site/chat/${data.chatroomId}`
        },
        onError: error => {
          console.error('Failed to create chatroom:', error)
          showError('교환 신청에 실패했습니다. 다시 시도해주세요.')
        },
      }
    )
  }

  // 모달 닫기
  const handleCloseModal = () => {
    if (createChatRoomMutation.isPending) return
    setShowExchangeModal(false)
    setSelectedBook(null)
  }

  if (profileLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="bg-white text-center py-12">
        <FaceFrownIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          사용자를 찾을 수 없습니다
        </h3>
        <p className="text-gray-600">
          존재하지 않거나 접근할 수 없는 사용자입니다.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* User Profile */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 bg-cover bg-center bg-gray-200 rounded-full"
            style={{
              backgroundImage: profile.profileImage
                ? `url(${profile.profileImage})`
                : 'none',
            }}
          >
            {!profile.profileImage && (
              <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {profile.nickname}
            </h3>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {profile.currentTown || '위치 정보 없음'}
            </p>
            {displayRating && (
              <div className="flex items-center text-xs text-gray-500">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1">{displayRating.toFixed(1)}</span>
                <span className="mx-1">•</span>
                <span>후기 {displayRatingCount}개</span>
              </div>
            )}
          </div>
          {!isOwnLibrary && (
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors">
                {profile.following ? '팔로잉' : '팔로우'}
              </button>
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
              >
                <StarIcon className="w-4 h-4" />
                별점 남기기
              </button>
            </div>
          )}
        </div>

        {profile.availableTime && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              <span className="font-medium">교환 가능 시간:</span>{' '}
              {profile.availableTime}
            </p>
          </div>
        )}
      </div>

      {/* Books Section */}
      <section>
        <LibraryBooksGrid
          userId={userId}
          isOwner={isOwnLibrary}
          onExchangeRequest={handleExchangeRequest}
          pageSize={12}
        />
      </section>

      {/* 별점 모달 */}
      {!isOwnLibrary && profile && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userId={userId}
          userName={profile.nickname}
        />
      )}

      {/* 교환 신청 확인 모달 */}
      {selectedBook && (
        <Modal
          isOpen={showExchangeModal}
          onClose={handleCloseModal}
          title="교환 신청 확인"
          closeOnBackdropClick={false}
          closeOnEsc={!createChatRoomMutation.isPending}
          size="sm"
          showCloseButton={false}
        >
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              <span className="font-medium">{profile?.nickname}</span>님에게{' '}
              <span className="font-medium text-primary-600">
                &quot;{selectedBook.bookTitle}&quot;
              </span>{' '}
              책의 교환을 신청하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              교환 신청 시 채팅방이 생성되며, 상대방과 대화를 시작할 수
              있습니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={createChatRoomMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleConfirmExchange}
                disabled={createChatRoomMutation.isPending}
                className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-lg font-medium hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createChatRoomMutation.isPending ? '신청 중...' : '신청하기'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
