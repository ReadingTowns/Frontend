'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useLibrary'
import { LibraryBooksGrid } from '@/components/library/LibraryBooksGrid'
import { useAuth } from '@/hooks/useAuth'
import { useCreateChatRoom } from '@/hooks/useChatRoom'
import { useUserRating } from '@/hooks/useUserRating'
import { useHeaderConfig } from '@/hooks/useHeaderConfig'
import { useState, useEffect } from 'react'
import RatingModal from '@/components/user/RatingModal'
import { Modal } from '@/components/common/Modal'
import { ProfileSkeleton } from '@/components/ui/Skeleton'
import {
  UserCircleIcon,
  FaceFrownIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import FollowButton from '@/components/neighbors/FollowButton'

export default function UserLibraryPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const { user: currentUser } = useAuth()

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

  // 팔로우 상태 관리
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(false)

  // profile.following 값으로 초기화
  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.following ?? false)
    }
  }, [profile])

  // 팔로우/언팔로우 Mutation (낙관적 업데이트 적용)
  const followMutation = useMutation({
    mutationFn: async (follow: boolean) => {
      if (follow) {
        return await api.post(`/api/v1/members/${userId}/follow`)
      } else {
        return await api.delete(`/api/v1/members/${userId}/follow`)
      }
    },
    onMutate: async follow => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({
        queryKey: ['user', 'profile', userId],
      })

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousData = queryClient.getQueryData(['user', 'profile', userId])

      // 낙관적 업데이트: 프로필 데이터의 팔로우 상태 즉시 변경
      queryClient.setQueryData(['user', 'profile', userId], (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        return {
          ...old,
          following: follow,
          followed: follow,
          isFollowing: follow,
        }
      })

      // 로컬 상태도 즉시 업데이트 (빠른 UI 반응)
      setIsFollowing(follow)

      return { previousData }
    },
    onError: (_error, _follow, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(
          ['user', 'profile', userId],
          context.previousData
        )
      }
      // 로컬 상태 롤백
      setIsFollowing(!isFollowing)

      // API 에러는 api.ts에서 자동으로 토스트 표시
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터 재조회 (데이터 일관성 보장)
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] })
    },
  })

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
          // ✅ FIX: 방어 코드 - data 검증
          if (!data?.chatroomId) {
            console.error('Invalid chatroom data:', data)
            // API 에러는 api.ts에서 자동으로 토스트 표시
            setShowExchangeModal(false)
            return
          }

          setShowExchangeModal(false)
          // Next.js Router로 채팅방 이동 (SPA 방식)
          router.push(`/chat/${data.chatroomId}`)
        },
        onError: error => {
          console.error('Failed to create chatroom:', error)
          // API 에러는 api.ts에서 자동으로 토스트 표시
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
              <FollowButton
                isFollowing={isFollowing}
                isLoading={followMutation.isPending}
                onClick={() => followMutation.mutate(!isFollowing)}
                size="md"
              />
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
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
