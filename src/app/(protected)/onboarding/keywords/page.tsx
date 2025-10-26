'use client'

import { useRouter } from 'next/navigation'
import { useKeywords } from '@/hooks/useKeywords'
import { useSaveKeywords } from '@/hooks/useSaveKeywords'
import KeywordSelectionFlow from '@/components/keyword/KeywordSelectionFlow'
import { useSnackbar } from '@/contexts/SnackbarContext'

/**
 * 키워드 선택 온보딩 페이지
 * - 사용자가 키워드를 선택하여 맞춤 추천을 받을 수 있음
 * - 온보딩 모달에서 "맞춤 추천 받기" 클릭 시 이동
 * - 마이페이지에서도 접근 가능
 */
export default function KeywordsOnboardingPage() {
  const router = useRouter()
  const { showSnackbar } = useSnackbar()
  const { data: categories, isLoading, error } = useKeywords()
  const saveKeywords = useSaveKeywords()

  const handleComplete = (selectedIds: number[]) => {
    saveKeywords.mutate(selectedIds, {
      onSuccess: () => {
        showSnackbar(
          '키워드가 저장되었습니다! 맞춤 추천을 확인해보세요.',
          'success'
        )
        router.push('/home')
      },
      onError: () => {
        showSnackbar('키워드 저장에 실패했습니다. 다시 시도해주세요.', 'error')
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">키워드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error || !categories) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            키워드를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-400 hover:bg-primary-500 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={handleCancel}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 정상 상태
  return (
    <div className="h-screen bg-white">
      <KeywordSelectionFlow
        categories={categories}
        onComplete={handleComplete}
        onCancel={handleCancel}
        isLoading={saveKeywords.isPending}
      />
    </div>
  )
}
