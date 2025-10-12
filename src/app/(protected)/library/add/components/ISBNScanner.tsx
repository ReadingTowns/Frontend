'use client'

import { useState, useRef, useEffect } from 'react'
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { fetchBookByISBN } from '@/lib/isbnService'
import type { BookInfo } from '@/types/book'

interface ISBNScannerProps {
  onISBNScanned: (isbn: string, bookInfo: BookInfo | null) => void
  onBack: () => void
}

export default function ISBNScanner({
  onISBNScanned,
  onBack,
}: ISBNScannerProps) {
  const [manualISBN, setManualISBN] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 컴포넌트 언마운트 시 카메라 스트림 정리
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // ISBN 유효성 검사
  const validateISBN = (isbn: string): boolean => {
    const cleanISBN = isbn.replace(/[-\s]/g, '')
    return cleanISBN.length === 10 || cleanISBN.length === 13
  }

  // 스캔된 ISBN 처리
  const processScannedISBN = async (isbn: string) => {
    setIsLookingUp(true)
    setError(null)

    try {
      const bookInfo = await fetchBookByISBN(isbn)
      onISBNScanned(isbn, bookInfo)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '책 정보를 가져오는데 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setIsLookingUp(false)
      setIsScanning(false)
    }
  }

  // 수동 ISBN 입력 처리 (API 호출 포함)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateISBN(manualISBN)) {
      setError('유효한 ISBN을 입력해주세요 (10자리 또는 13자리)')
      return
    }

    const cleanISBN = manualISBN.replace(/[-\s]/g, '')
    setIsLookingUp(true)
    setError(null)

    try {
      // API 호출하여 책 정보 조회
      const bookInfo = await fetchBookByISBN(cleanISBN)

      // 성공 시 다음 화면으로 이동
      onISBNScanned(cleanISBN, bookInfo)
    } catch (err) {
      // 에러 발생 시 에러 메시지 표시
      setError(
        err instanceof Error
          ? err.message
          : '책 정보를 가져오는데 실패했습니다. ISBN을 확인하고 다시 시도해주세요.'
      )
    } finally {
      setIsLookingUp(false)
    }
  }

  // 카메라 시작 및 바코드 스캔
  const handleCameraCapture = async () => {
    console.log('[ISBNScanner] 카메라 시작 버튼 클릭됨')
    console.log('[ISBNScanner] videoRef.current:', videoRef.current)
    console.log('[ISBNScanner] isScanning:', isScanning)
    console.log('[ISBNScanner] isLookingUp:', isLookingUp)

    setIsScanning(true)
    setError(null)

    try {
      console.log('[ISBNScanner] getUserMedia 호출 시작')

      // 카메라 스트림 가져오기 (고해상도 + 자동 초점)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // 후면 카메라 우선
          width: { ideal: 1920 }, // 고해상도
          height: { ideal: 1080 }, // 고해상도
          aspectRatio: { ideal: 16 / 9 },
          // @ts-expect-error - focusMode는 일부 브라우저에서 지원
          focusMode: { ideal: 'continuous' }, // 자동 초점
        },
      })

      console.log('[ISBNScanner] 카메라 스트림 획득 성공:', stream)

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // EAN-13 전용 BrowserMultiFormatReader 초기화 (ISBN-13 바코드)
      if (!codeReaderRef.current) {
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13, // ISBN-13
          BarcodeFormat.EAN_8, // ISBN-10 (일부)
        ])
        codeReaderRef.current = new BrowserMultiFormatReader(hints)
      }

      const codeReader = codeReaderRef.current

      // videoRef가 null이 아닌지 확인
      if (!videoRef.current) {
        throw new Error('비디오 요소를 찾을 수 없습니다.')
      }

      // 연속 스캔 시작
      const controls = await codeReader.decodeFromVideoElement(
        videoRef.current,
        (result, error) => {
          if (result) {
            // 바코드 인식 성공
            const scannedText = result.getText()

            // ISBN 유효성 검사
            if (validateISBN(scannedText)) {
              const cleanISBN = scannedText.replace(/[-\s]/g, '')

              // 스캔 중지
              stopCamera()

              // ISBN 처리
              processScannedISBN(cleanISBN)
            }
          }

          if (error) {
            // 바코드를 찾지 못한 경우는 정상 동작 (계속 스캔)
            // 다른 에러만 콘솔에 기록
            if (error.name !== 'NotFoundException') {
              console.error('Barcode scan error:', error)
            }
          }
        }
      )

      // controls를 ref에 저장 (나중에 중지할 수 있도록)
      codeReaderRef.current = controls as unknown as BrowserMultiFormatReader
    } catch (err) {
      console.error('[ISBNScanner] 카메라 에러:', err)
      console.error(
        '[ISBNScanner] 에러 타입:',
        err instanceof Error ? err.name : 'Unknown'
      )
      console.error(
        '[ISBNScanner] 에러 메시지:',
        err instanceof Error ? err.message : err
      )

      let errorMessage = '카메라를 시작할 수 없습니다. 권한을 확인해주세요.'

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage =
            '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.'
        } else if (err.name === 'NotFoundError') {
          errorMessage =
            '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.'
        } else if (err.name === 'NotSupportedError') {
          errorMessage =
            'HTTPS 환경에서만 카메라를 사용할 수 있습니다. https://dev.readingtown.site에서 접속해주세요.'
        } else if (err.name === 'OverconstrainedError') {
          errorMessage =
            '후면 카메라를 찾을 수 없습니다. 전면 카메라로 시도합니다.'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setIsScanning(false)
    }
  }

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setError(null)

    let imageUrl = ''

    try {
      // EAN-13 전용 BrowserMultiFormatReader 초기화 (ISBN-13 바코드)
      if (!codeReaderRef.current) {
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13, // ISBN-13
          BarcodeFormat.EAN_8, // ISBN-10 (일부)
        ])
        codeReaderRef.current = new BrowserMultiFormatReader(hints)
      }

      const codeReader = codeReaderRef.current

      // 이미지 URL 생성
      imageUrl = URL.createObjectURL(file)

      // HTMLImageElement 생성 및 이미지 로드
      const image = new Image()
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'))
        image.src = imageUrl
      })

      // 이미지에서 바코드 디코딩
      const result = await codeReader.decodeFromImageElement(image)

      const scannedText = result.getText()

      // ISBN 유효성 검사
      if (!validateISBN(scannedText)) {
        throw new Error('유효한 ISBN 바코드를 찾을 수 없습니다.')
      }

      const cleanISBN = scannedText.replace(/[-\s]/g, '')

      // ISBN 처리
      await processScannedISBN(cleanISBN)
    } catch (err) {
      console.error('Image scan error:', err)
      setError(
        err instanceof Error
          ? err.message
          : '이미지에서 바코드를 인식할 수 없습니다. 다시 시도해주세요.'
      )
      setIsScanning(false)
    } finally {
      // Object URL 정리
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
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

          {/* 로딩 상태 표시 */}
          {isLookingUp && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                <p className="text-blue-800">책 정보를 조회하고 있습니다...</p>
              </div>
            </div>
          )}

          {/* 카메라 스캔 영역 */}
          <div className="mb-6">
            <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              {/* 비디오 요소 - 항상 렌더링하되 isScanning이 false일 때 숨김 */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`}
              />

              {/* 스캔 가이드라인 - isScanning일 때만 표시 */}
              {isScanning && (
                <>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 border-t-2 border-l-2 border-primary-400" />
                    <div className="absolute top-1/4 right-1/4 w-4 h-4 border-t-2 border-r-2 border-primary-400" />
                    <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-b-2 border-l-2 border-primary-400" />
                    <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-b-2 border-r-2 border-primary-400" />
                  </div>
                  {/* 스캔 중지 버튼 */}
                  <button
                    onClick={stopCamera}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    중지
                  </button>
                </>
              )}

              {/* 시작 화면 - isScanning이 false일 때만 표시 */}
              {!isScanning && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CameraIcon className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    책 뒷면의 바코드를 스캔하세요
                  </p>
                  <button
                    onClick={() => {
                      console.log('[ISBNScanner] 버튼 onClick 이벤트 발생')
                      handleCameraCapture()
                    }}
                    disabled={isScanning || isLookingUp}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    카메라 시작
                  </button>
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
                disabled={isScanning || isLookingUp}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <PhotoIcon className="w-5 h-5" />
                갤러리에서 선택
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
                disabled={isLookingUp}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLookingUp ? '조회 중...' : '확인'}
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
