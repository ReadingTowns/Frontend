'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showSuccess } from '@/lib/toast'
import { useQuery } from '@tanstack/react-query'
import BookCoverUpload from './BookCoverUpload'
import { fetchBookByISBN } from '@/lib/isbnService'
import type { BookInfo } from '@/types/book'
import { useAddLibraryBook } from '@/hooks/useLibrary'

interface BookFormProps {
  initialISBN?: string
  initialBookInfo?: BookInfo | null
  onBack: () => void
}

interface BookData {
  isbn?: string
  title: string
  author: string
  publisher: string
  image?: string
}

export default function BookForm({
  initialISBN = '',
  initialBookInfo = null,
  onBack,
}: BookFormProps) {
  const router = useRouter()
  const addBookMutation = useAddLibraryBook()

  const [formData, setFormData] = useState<BookData>({
    isbn: initialISBN,
    title: initialBookInfo?.title || '',
    author: initialBookInfo?.author || '',
    publisher: initialBookInfo?.publisher || '',
    image: initialBookInfo?.coverImage || '',
  })

  const [errors, setErrors] = useState<Partial<BookData>>({})
  const [manualISBN, setManualISBN] = useState('')
  const [isManualSearch, setIsManualSearch] = useState(false)

  // ISBN으로 책 정보 조회 (알라딘 API 사용) - 수동 검색용
  const currentISBN = isManualSearch ? manualISBN : ''

  const {
    data: bookInfo,
    isLoading: isLookingUp,
    error: lookupError,
    refetch: refetchBookInfo,
  } = useQuery<BookInfo | null>({
    queryKey: ['isbn-lookup', currentISBN],
    queryFn: async () => {
      if (!currentISBN) return null
      try {
        const result = await fetchBookByISBN(currentISBN)
        return result
      } catch (error) {
        console.error('ISBN 조회 실패:', error)
        throw error
      }
    },
    enabled: false, // 수동으로만 실행
    retry: 1,
  })

  // 수동 ISBN 검색 핸들러
  const handleManualISBNSearch = () => {
    if (manualISBN.length >= 10) {
      setIsManualSearch(true)
      refetchBookInfo()
    }
  }

  // ISBN 조회 결과로 폼 자동 채우기 (수동 검색 결과)
  useEffect(() => {
    if (bookInfo) {
      setFormData(prev => ({
        ...prev,
        title: bookInfo.title,
        author: bookInfo.author,
        publisher: bookInfo.publisher,
        isbn: bookInfo.isbn,
        image: bookInfo.coverImage,
      }))
    }
  }, [bookInfo])

  // 책 등록 성공 시 처리
  useEffect(() => {
    if (addBookMutation.isSuccess) {
      showSuccess('책이 성공적으로 등록되었습니다!')
      router.push('/library')
    }
  }, [addBookMutation.isSuccess, router])

  // 책 등록 실패 시 처리는 api.ts에서 자동으로 토스트 표시

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<BookData> = {}

    if (!formData.title?.trim()) {
      newErrors.title = '책 제목을 입력해주세요'
    }

    if (!formData.author?.trim()) {
      newErrors.author = '저자를 입력해주세요'
    }

    if (!formData.publisher?.trim()) {
      newErrors.publisher = '출판사를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // AddLibraryBookRequest 형식에 맞게 변환
    addBookMutation.mutate({
      isbn: formData.isbn || '',
      image: formData.image || '',
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
    })
  }

  // 입력 필드 변경 처리
  const handleInputChange = (field: keyof BookData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 표지 이미지 변경 처리
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }))
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 p-4">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← 뒤로
        </button>

        {/* ISBN 수동 입력 섹션 (스캔하지 않은 경우) */}
        {!initialISBN && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ISBN으로 책 찾기
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualISBN}
                onChange={e =>
                  setManualISBN(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="ISBN 10자리 또는 13자리 입력"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                maxLength={13}
              />
              <button
                type="button"
                onClick={handleManualISBNSearch}
                disabled={manualISBN.length < 10 || isLookingUp}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                검색
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              책 뒷면의 바코드 아래 숫자를 입력하세요
            </p>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLookingUp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
              <p className="text-blue-800">ISBN 정보를 조회하고 있습니다...</p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {lookupError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  ISBN 조회 실패
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {lookupError instanceof Error
                      ? lookupError.message
                      : '책 정보를 가져올 수 없습니다. 직접 입력해주세요.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {!isLookingUp && !lookupError && currentISBN && bookInfo === null && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  검색 결과 없음
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    해당 ISBN으로 책을 찾을 수 없습니다. 아래에 직접
                    입력해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            책 정보 입력
          </h2>

          {/* 표지 이미지 업로드 */}
          <BookCoverUpload
            imageUrl={formData.image}
            onImageChange={handleImageChange}
          />

          {/* ISBN */}
          {formData.isbn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={e => handleInputChange('isbn', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          )}

          {/* 책 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              책 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="책 제목을 입력해주세요"
              className={`w-full px-4 py-3 border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 저자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              저자 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={e => handleInputChange('author', e.target.value)}
              placeholder="저자명을 입력해주세요"
              className={`w-full px-4 py-3 border ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          {/* 출판사 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출판사 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.publisher}
              onChange={e => handleInputChange('publisher', e.target.value)}
              placeholder="출판사명을 입력해주세요"
              className={`w-full px-4 py-3 border ${
                errors.publisher ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
            />
            {errors.publisher && (
              <p className="mt-1 text-sm text-red-600">{errors.publisher}</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={addBookMutation.isPending}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {addBookMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  등록 중...
                </div>
              ) : (
                '서재에 등록하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
