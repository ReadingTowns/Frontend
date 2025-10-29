'use client'

import { useRouter } from 'next/navigation'
import { useRecommendKeywords } from '@/hooks/useRecommendKeywords'

export default function KeywordSelector() {
  const router = useRouter()
  const { data: keywords, isLoading, error } = useRecommendKeywords()

  const handleRedoKeywordSelection = () => {
    router.push('/recommendations/keywords/edit')
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-white">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">맞춤 추천받기</h2>
        <p className="text-gray-500">키워드를 불러올 수 없습니다</p>
      </div>
    )
  }

  if (!keywords || keywords.length === 0) {
    return (
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">맞춤 추천받기</h2>
        <p className="text-gray-500 mb-4">아직 선택한 키워드가 없습니다</p>
        <button
          onClick={handleRedoKeywordSelection}
          className="w-full py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          키워드 선택하기
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">맞춤 추천받기</h2>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          현재 선택한 키워드
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map(keyword => (
            <span
              key={keyword.id}
              className="px-3 py-1.5 bg-gray-100 text-sm rounded-full text-gray-700"
            >
              {keyword.content}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleRedoKeywordSelection}
        className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        키워드 선택 다시하기
      </button>
    </div>
  )
}

KeywordSelector.displayName = 'KeywordSelector'
