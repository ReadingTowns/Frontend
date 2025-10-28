'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import {
  CameraIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import ISBNScanner from './components/ISBNScanner'
import BookForm from './components/BookForm'
import BookSearchTab from './components/BookSearchTab'
import BookConfirmation from './components/BookConfirmation'
import type { BookInfo, BookSearchResult } from '@/types/book'

type RegistrationMethod = 'select' | 'scan' | 'search' | 'manual'
type RegistrationStep = 'method' | 'search' | 'confirm'

export default function AddBookClient() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [registrationMethod, setRegistrationMethod] =
    useState<RegistrationMethod>('select')
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>('method')
  const [scannedISBN, setScannedISBN] = useState<string>('')
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null
  )

  // 헤더 설정
  useEffect(() => {
    setHeaderContent(
      <header className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-gray-900">책 등록하기</h1>
        <p className="text-sm text-gray-600 mt-2">
          서재에 새로운 책을 추가해보세요
        </p>
      </header>
    )

    return () => {
      setHeaderContent(null)
    }
  }, [setHeaderContent, router])

  const handleISBNScanned = (isbn: string, info: BookInfo | null) => {
    setScannedISBN(isbn)
    setBookInfo(info)
    setRegistrationMethod('manual')
    setRegistrationStep('method')
  }

  const handleBackToSelection = () => {
    setRegistrationMethod('select')
    setRegistrationStep('method')
    setScannedISBN('')
    setBookInfo(null)
    setSelectedBook(null)
  }

  const handleBookSelect = (book: BookSearchResult) => {
    setSelectedBook(book)
    setRegistrationStep('confirm')
  }

  const handleBackToSearch = () => {
    setRegistrationStep('search')
    setSelectedBook(null)
  }

  // 등록 방법 선택 화면 (탭 구조)
  if (registrationMethod === 'select') {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 탭 네비게이션 */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => {
                setRegistrationMethod('scan')
                setRegistrationStep('method')
              }}
              className="flex-1 py-4 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors"
            >
              <CameraIcon className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm font-medium">ISBN 스캔</span>
            </button>
            <button
              onClick={() => {
                setRegistrationMethod('search')
                setRegistrationStep('search')
              }}
              className="flex-1 py-4 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MagnifyingGlassIcon className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm font-medium">책 검색</span>
            </button>
            <button
              onClick={() => {
                setRegistrationMethod('manual')
                setRegistrationStep('method')
              }}
              className="flex-1 py-4 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors"
            >
              <PencilSquareIcon className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm font-medium">직접 입력</span>
            </button>
          </div>
        </div>

        {/* 안내 */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">등록 방법을 선택하세요</p>
            <p className="text-sm mt-2">
              ISBN 스캔, 책 검색 또는 직접 입력 중 선택할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ISBN 스캔 화면
  if (registrationMethod === 'scan') {
    return (
      <ISBNScanner
        onISBNScanned={handleISBNScanned}
        onBack={handleBackToSelection}
      />
    )
  }

  // 책 검색 플로우
  if (registrationMethod === 'search') {
    // 책 확인 화면
    if (registrationStep === 'confirm' && selectedBook) {
      return (
        <BookConfirmation book={selectedBook} onBack={handleBackToSearch} />
      )
    }

    // 검색 화면
    return (
      <BookSearchTab
        onBookSelect={handleBookSelect}
        onBack={handleBackToSelection}
      />
    )
  }

  // 책 정보 입력 폼
  return (
    <BookForm
      initialISBN={scannedISBN}
      initialBookInfo={bookInfo}
      onBack={handleBackToSelection}
    />
  )
}
