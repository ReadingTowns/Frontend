'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAddLibraryBook } from '@/hooks/useLibrary'

export default function AddLibraryBookPage() {
  const router = useRouter()
  const addBook = useAddLibraryBook()

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    image: '',
  })

  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.author) {
      alert('책 제목과 작가는 필수 항목입니다.')
      return
    }

    addBook.mutate(formData, {
      onSuccess: () => {
        alert('책이 성공적으로 서재에 등록되었습니다!')
        router.push('/library')
      },
      onError: error => {
        alert('책 등록에 실패했습니다. 다시 시도해주세요.')
        console.error('Add book error:', error)
      },
    })
  }

  const handleBookSearch = () => {
    // TODO: 실제 책 검색 API 연동
    if (searchQuery) {
      // 임시로 검색어를 제목으로 설정
      setFormData(prev => ({
        ...prev,
        title: searchQuery,
        author: '검색된 작가',
        publisher: '검색된 출판사',
        isbn: Math.random().toString().substr(2, 13),
        image: `https://via.placeholder.com/120x180?text=${encodeURIComponent(searchQuery)}`,
      }))
    }
  }

  const handleISBNScan = () => {
    // TODO: ISBN 스캔 기능 구현
    alert('ISBN 스캔 기능은 추후 구현 예정입니다.')
  }

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen py-4 px-4">
      {/* Header */}
      <header className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-900">책 등록</h1>
        <p className="text-sm text-gray-600 mt-2">
          서재에 추가할 책 정보를 입력해주세요
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            책 검색
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="책 제목을 입력하세요"
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={handleBookSearch}
              className="px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              검색
            </button>
            <button
              type="button"
              onClick={handleISBNScan}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              📷
            </button>
          </div>
        </div>

        {/* Book Image Preview */}
        {formData.image && (
          <div className="flex justify-center">
            <div
              className="w-24 h-36 bg-cover bg-center rounded-lg border border-gray-200"
              style={{ backgroundImage: `url(${formData.image})` }}
            />
          </div>
        )}

        {/* Book Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            책 제목 *
          </label>
          <input
            type="text"
            placeholder="책 제목을 입력해주세요"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            작가 *
          </label>
          <input
            type="text"
            placeholder="작가명을 입력해주세요"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            value={formData.author}
            onChange={e =>
              setFormData(prev => ({ ...prev, author: e.target.value }))
            }
            required
          />
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            출판사
          </label>
          <input
            type="text"
            placeholder="출판사명을 입력해주세요"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            value={formData.publisher}
            onChange={e =>
              setFormData(prev => ({ ...prev, publisher: e.target.value }))
            }
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISBN
          </label>
          <input
            type="text"
            placeholder="ISBN을 입력해주세요 (선택사항)"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            value={formData.isbn}
            onChange={e =>
              setFormData(prev => ({ ...prev, isbn: e.target.value }))
            }
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            책 표지 이미지 URL (선택사항)
          </label>
          <input
            type="url"
            placeholder="https://example.com/book-cover.jpg"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            value={formData.image}
            onChange={e =>
              setFormData(prev => ({ ...prev, image: e.target.value }))
            }
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={addBook.isPending || !formData.title || !formData.author}
          >
            {addBook.isPending ? (
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
  )
}
