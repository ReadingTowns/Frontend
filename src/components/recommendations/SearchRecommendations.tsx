'use client'

import { useState, useMemo } from 'react'
import { useRecommendVideo } from '@/hooks/useRecommendVideo'
import { useRecommendBookSearch } from '@/hooks/useRecommendBookSearch'
import { debounce } from 'lodash'
import Link from 'next/link'

export default function SearchRecommendations() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce 적용
  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setSearchQuery(value), 300),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSetQuery(value)
  }

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
  } = useRecommendVideo(searchQuery, searchQuery.length > 0)

  const {
    data: bookData,
    isLoading: bookLoading,
    error: bookError,
  } = useRecommendBookSearch(searchQuery, searchQuery.length > 0)

  const videos = videoData || []
  const books = bookData?.result?.results || []

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        내 취향으로 책 검색하여 추천받기
      </h2>

      <input
        type="text"
        placeholder="키워드를 입력해주세요. ex) 사랑"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        value={inputValue}
        onChange={handleInputChange}
      />

      {/* 유튜브 영상 */}
      {videoLoading && searchQuery && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">영상 제목</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 h-36 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">영상 제목</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {videos.map((video, idx) => (
              <a
                key={idx}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-64 h-36 object-cover rounded-lg"
                />
                <p className="text-sm mt-2 line-clamp-2 w-64">{video.title}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {videoError && searchQuery && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">영상 제목</h3>
          <p className="text-gray-500 text-sm">영상을 불러올 수 없습니다</p>
        </div>
      )}

      {/* 책 추천 */}
      {bookLoading && searchQuery && (
        <div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-48 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {books.length > 0 && (
        <div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {books.map(book => (
              <Link
                key={book.book_id}
                href={`/books/${book.book_id}`}
                className="flex-shrink-0 w-32"
              >
                <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-gray-500 p-2 text-center">
                    이미지 없음
                  </p>
                </div>
                <p className="text-sm font-medium mt-2 line-clamp-2">
                  {book.book_name}
                </p>
                <p className="text-xs text-primary-600 mt-1">
                  {(book.similarity_score * 100).toFixed(0)}%
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {bookError && searchQuery && (
        <div>
          <p className="text-gray-500 text-sm">책 검색은 아직 구현 중입니다</p>
        </div>
      )}

      {searchQuery &&
        !videoLoading &&
        !bookLoading &&
        videos.length === 0 &&
        books.length === 0 &&
        !videoError &&
        !bookError && (
          <p className="text-gray-500 text-center py-8">검색 결과가 없습니다</p>
        )}
    </div>
  )
}

SearchRecommendations.displayName = 'SearchRecommendations'
