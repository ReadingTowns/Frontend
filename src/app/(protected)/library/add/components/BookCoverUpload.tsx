'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface BookCoverUploadProps {
  imageUrl?: string
  onImageChange: (url: string) => void
}

export default function BookCoverUpload({
  imageUrl,
  onImageChange,
}: BookCoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || '')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      // 실제 구현 시에는 S3나 서버에 업로드 후 URL 반환
      // 여기서는 임시로 data URL 사용
      onImageChange(result)
    }
    reader.readAsDataURL(file)

    // 실제 구현 시 서버 업로드
    // uploadToServer(file)
  }

  const handleUrlInput = () => {
    const url = prompt('이미지 URL을 입력하세요:')
    if (url) {
      setPreviewUrl(url)
      onImageChange(url)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        책 표지 이미지
      </label>

      <div className="flex items-start gap-4">
        {/* 이미지 프리뷰 */}
        <div className="relative w-32 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {previewUrl ? (
            <>
              {previewUrl.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="책 표지"
                  className="w-full h-full object-cover"
                />
              ) : previewUrl.startsWith('http') ? (
                <Image
                  src={previewUrl}
                  alt="책 표지"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📚</span>
                </div>
              )}
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-2">📷</span>
              <span className="text-xs text-center px-2">표지 추가</span>
            </div>
          )}
        </div>

        {/* 업로드 버튼들 */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                업로드 중...
              </div>
            ) : (
              '📁 파일 선택'
            )}
          </button>

          <button
            type="button"
            onClick={handleUrlInput}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            🔗 URL 입력
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            📸 사진 촬영
          </button>

          <p className="text-xs text-gray-500 mt-2">
            권장: JPG, PNG (최대 5MB)
          </p>
        </div>
      </div>
    </div>
  )
}
