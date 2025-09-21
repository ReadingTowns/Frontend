'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import BookCoverUpload from './BookCoverUpload'

interface BookFormProps {
  initialISBN?: string
  onBack: () => void
}

interface BookData {
  isbn?: string
  title: string
  author: string
  publisher: string
  image?: string
}

export default function BookForm({ initialISBN = '', onBack }: BookFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<BookData>({
    isbn: initialISBN,
    title: '',
    author: '',
    publisher: '',
    image: '',
  })

  const [errors, setErrors] = useState<Partial<BookData>>({})

  // ISBN으로 책 정보 조회 (초기 ISBN이 있을 경우)
  const { data: bookInfo, isLoading: isLookingUp } = useQuery({
    queryKey: ['isbn-lookup', initialISBN],
    queryFn: async () => {
      // 실제로는 외부 API (알라딘 등) 호출
      // 여기서는 모의 데이터 반환
      if (initialISBN === '9788936433598') {
        return {
          title: '채식주의자',
          author: '한강',
          publisher: '창비',
          image:
            'https://image.aladin.co.kr/product/19287/47/cover500/8936433598_1.jpg',
        }
      } else if (initialISBN === '9791190090018') {
        return {
          title: '아몬드',
          author: '손원평',
          publisher: '창비',
          image:
            'https://image.aladin.co.kr/product/19113/50/cover500/k152635813_1.jpg',
        }
      }
      return null
    },
    enabled: !!initialISBN && initialISBN.length >= 10,
  })

  // ISBN 조회 결과로 폼 자동 채우기
  useEffect(() => {
    if (bookInfo) {
      setFormData(prev => ({
        ...prev,
        ...bookInfo,
        isbn: initialISBN,
      }))
    }
  }, [bookInfo, initialISBN])

  // 책 등록 API
  const registerBookMutation = useMutation({
    mutationFn: async (data: BookData) => {
      const response = await fetch('/api/v1/bookhouse/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '책 등록에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      alert('책이 성공적으로 등록되었습니다!')
      router.push('/library')
    },
    onError: (error: Error) => {
      alert(error.message || '책 등록에 실패했습니다. 다시 시도해주세요.')
    },
  })

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

    registerBookMutation.mutate(formData)
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

        {isLookingUp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
              <p className="text-blue-800">ISBN 정보를 조회하고 있습니다...</p>
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
              disabled={registerBookMutation.isPending}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {registerBookMutation.isPending ? (
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
