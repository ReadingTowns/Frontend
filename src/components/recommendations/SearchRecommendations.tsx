'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRecommendVideo } from '@/hooks/useRecommendVideo'
import { useRecommendBookSearch } from '@/hooks/useRecommendBookSearch'
import { debounce } from 'lodash'
import Link from 'next/link'

export default function SearchRecommendations() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const bookSectionRef = useRef<HTMLDivElement>(null)

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
  const books = bookData?.results || []

  // 비디오 스켈레톤 표시 시 즉시 스크롤
  useEffect(() => {
    if (videoLoading && searchQuery && videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [videoLoading, searchQuery])

  // 비디오 결과 로드 완료 시 즉시 스크롤
  useEffect(() => {
    if (videos.length > 0 && videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [videos.length])

  // 책 스켈레톤 표시 시 즉시 스크롤
  useEffect(() => {
    if (bookLoading && searchQuery && bookSectionRef.current) {
      bookSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [bookLoading, searchQuery])

  // 책 결과 로드 완료 시 즉시 스크롤
  useEffect(() => {
    if (books.length > 0 && bookSectionRef.current) {
      bookSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [books.length])

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
        <div className="mb-6" ref={videoSectionRef}>
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
        <div className="mb-6" ref={videoSectionRef}>
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
        <div ref={bookSectionRef}>
          <h3 className="text-lg font-semibold mb-3">책 추천 검색 중...</h3>
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
        <div ref={bookSectionRef}>
          <h3 className="text-lg font-semibold mb-3">책 추천 결과</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {books.map(book => (
              <Link
                key={book.bookId}
                href={`/books/${book.bookId}`}
                className="flex-shrink-0 w-32"
              >
                <div className="w-32 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center p-2">
                  {book.bookImage ? (
                    <img
                      src={book.bookImage}
                      alt={book.bookName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium line-clamp-3">
                        {book.bookName}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium mt-2 line-clamp-2">
                  {book.bookName}
                </p>
                <p className="text-xs text-gray-600 line-clamp-1">
                  {book.author}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-primary-600 font-semibold">
                    {(book.similarity * 100).toFixed(0)}% 일치
                  </p>
                </div>
                {book.relatedUserKeywords &&
                  book.relatedUserKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {book.relatedUserKeywords
                        .slice(0, 2)
                        .map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded"
                          >
                            #{keyword}
                          </span>
                        ))}
                    </div>
                  )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {bookError && searchQuery && (
        <div>
          <p className="text-gray-500 text-sm">
            책 검색 중 문제가 발생했습니다
          </p>
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
