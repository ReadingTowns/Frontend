'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeader } from '@/contexts/HeaderContext'
import ISBNScanner from './components/ISBNScanner'
import BookForm from './components/BookForm'

type RegistrationMethod = 'select' | 'scan' | 'manual'

export default function AddBookClient() {
  const router = useRouter()
  const { setHeaderContent } = useHeader()
  const [registrationMethod, setRegistrationMethod] =
    useState<RegistrationMethod>('select')
  const [scannedISBN, setScannedISBN] = useState<string>('')

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

  const handleISBNScanned = (isbn: string) => {
    setScannedISBN(isbn)
    setRegistrationMethod('manual')
  }

  const handleBackToSelection = () => {
    setRegistrationMethod('select')
    setScannedISBN('')
  }

  // 등록 방법 선택 화면
  if (registrationMethod === 'select') {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 p-4 space-y-4">
          {/* ISBN 스캔 옵션 */}
          <button
            onClick={() => setRegistrationMethod('scan')}
            className="w-full bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <div className="ml-4 flex-1 text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  ISBN 바코드 스캔
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  책 뒷면의 바코드를 카메라로 스캔하세요
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          {/* 직접 입력 옵션 */}
          <button
            onClick={() => setRegistrationMethod('manual')}
            className="w-full bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4 flex-1 text-left">
                <h3 className="text-lg font-medium text-gray-900">직접 입력</h3>
                <p className="text-sm text-gray-500 mt-1">
                  책 정보를 직접 입력하세요
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          {/* 추가 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tip</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    ISBN 스캔을 사용하면 책 정보를 자동으로 가져올 수 있어 더
                    빠르게 등록할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
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

  // 책 정보 입력 폼
  return <BookForm initialISBN={scannedISBN} onBack={handleBackToSelection} />
}
