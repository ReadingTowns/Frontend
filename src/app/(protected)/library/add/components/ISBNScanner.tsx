'use client'

import { useState, useRef } from 'react'

interface ISBNScannerProps {
  onISBNScanned: (isbn: string) => void
  onBack: () => void
}

export default function ISBNScanner({
  onISBNScanned,
  onBack,
}: ISBNScannerProps) {
  const [manualISBN, setManualISBN] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ISBN 유효성 검사
  const validateISBN = (isbn: string): boolean => {
    const cleanISBN = isbn.replace(/[-\s]/g, '')
    return cleanISBN.length === 10 || cleanISBN.length === 13
  }

  // 수동 ISBN 입력 처리
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateISBN(manualISBN)) {
      setError('유효한 ISBN을 입력해주세요 (10자리 또는 13자리)')
      return
    }

    onISBNScanned(manualISBN.replace(/[-\s]/g, ''))
  }

  // 카메라 촬영 시뮬레이션 (실제로는 바코드 스캔 라이브러리 사용)
  const handleCameraCapture = () => {
    setIsScanning(true)
    setError(null)

    // 실제 구현 시에는 react-qr-reader 또는 html5-qrcode 사용
    setTimeout(() => {
      setIsScanning(false)
      // 테스트용 샘플 ISBN
      const sampleISBN = '9788936433598' // 샘플 ISBN (채식주의자)
      onISBNScanned(sampleISBN)
    }, 2000)
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsScanning(true)
      setError(null)

      // 실제로는 이미지에서 바코드를 인식하는 처리
      setTimeout(() => {
        setIsScanning(false)
        // 테스트용 샘플 ISBN
        const sampleISBN = '9791190090018' // 샘플 ISBN
        onISBNScanned(sampleISBN)
      }, 2000)
    }
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            ISBN 바코드 스캔
          </h2>

          {/* 카메라 스캔 영역 */}
          <div className="mb-6">
            <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">스캔 중...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">📷</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    책 뒷면의 바코드를 스캔하세요
                  </p>
                  <button
                    onClick={handleCameraCapture}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    카메라 시작
                  </button>
                </div>
              )}

              {/* 스캔 가이드라인 */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 border-t-2 border-l-2 border-primary-400" />
                  <div className="absolute top-1/4 right-1/4 w-4 h-4 border-t-2 border-r-2 border-primary-400" />
                  <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-b-2 border-l-2 border-primary-400" />
                  <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-b-2 border-r-2 border-primary-400" />
                </div>
              )}
            </div>

            {/* 갤러리에서 선택 버튼 */}
            <div className="flex justify-center mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📸 갤러리에서 선택
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 수동 ISBN 입력 */}
          <form onSubmit={handleManualSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN 직접 입력
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualISBN}
                onChange={e => {
                  setManualISBN(e.target.value)
                  setError(null)
                }}
                placeholder="978-89-364-3359-8"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                확인
              </button>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <p className="mt-2 text-xs text-gray-500">
              ISBN은 책 뒷면 바코드 아래에 있는 10자리 또는 13자리 숫자입니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
