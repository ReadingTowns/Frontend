'use client'

import { BookOpenIcon, FireIcon } from '@heroicons/react/24/solid'

interface LibraryStatsProps {
  totalBooks: number
  completionRate?: number
  isLoading?: boolean
}

export function LibraryStats({
  totalBooks,
  completionRate = 0,
  isLoading = false,
}: LibraryStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">나의 서재</h3>
        <span className="text-xs text-gray-500">총 {totalBooks}권</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Books */}
        <div className="text-center">
          <div className="text-xl font-bold text-primary-600 mb-1">
            {totalBooks}
          </div>
          <div className="text-xs text-gray-600">등록한 책</div>
        </div>

        {/* Completion Rate */}
        <div className="text-center">
          <div className="text-xl font-bold text-secondary-600 mb-1">
            {Math.round(completionRate)}%
          </div>
          <div className="text-xs text-gray-600">완독률</div>
        </div>
      </div>

      {/* Progress Bar */}
      {completionRate > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
            <span>독서 진행도</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-400 to-secondary-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Reading Streak */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-600">이번 달 독서</span>
            <span className="ml-2 text-primary-600 font-semibold flex items-center gap-1">
              <BookOpenIcon className="w-4 h-4" />
              {Math.floor(totalBooks / 4)}권
            </span>
          </div>
          {totalBooks > 0 && (
            <div className="text-xs text-green-600 font-medium flex items-center gap-1">
              활발히 활동 중!
              <FireIcon className="w-4 h-4 text-orange-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
