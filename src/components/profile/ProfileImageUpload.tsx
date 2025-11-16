'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { CameraIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useProfileImageUpload } from '@/hooks/useProfileImage'
import { showSuccess, showError, showWarning } from '@/lib/toast'

interface ProfileImageUploadProps {
  currentImage?: string
  onImageChange?: (url: string) => void
  size?: 'small' | 'medium' | 'large'
  editable?: boolean
}

const SIZE_CLASSES = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-32 h-32',
}

const ICON_SIZE_CLASSES = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
}

export default function ProfileImageUpload({
  currentImage,
  onImageChange,
  size = 'large',
  editable = true,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage)
  const { uploadProfileImage, isUploading } = useProfileImageUpload()

  // Sync previewUrl with currentImage prop changes
  useEffect(() => {
    setPreviewUrl(currentImage)
  }, [currentImage])

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showWarning('JPEG, PNG, WebP 형식의 이미지만 업로드 가능합니다.')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      showWarning('5MB 이하의 이미지만 업로드 가능합니다.')
      return
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    try {
      // Upload to S3 and get URL
      const s3Url = await uploadProfileImage(file)

      // Update parent component
      onImageChange?.(s3Url)

      showSuccess('프로필 사진이 변경되었습니다.')

      // Clean up object URL
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(s3Url)
    } catch (error) {
      // Revert preview on error
      setPreviewUrl(currentImage)
      URL.revokeObjectURL(objectUrl)

      const message =
        error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.'
      showError(message)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const sizeClass = SIZE_CLASSES[size]
  const iconSizeClass = ICON_SIZE_CLASSES[size]

  return (
    <div className="relative inline-block">
      {/* Profile Image Container */}
      <div
        className={`${sizeClass} relative rounded-full overflow-hidden bg-gray-100 ${
          editable && !isUploading ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="프로필 이미지"
            fill
            className="object-cover"
            sizes={
              size === 'large' ? '128px' : size === 'medium' ? '96px' : '64px'
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircleIcon className={`${iconSizeClass} text-gray-400`} />
          </div>
        )}
      </div>

      {/* Camera Icon Button (positioned at bottom-right) */}
      {editable && !isUploading && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-primary-400 hover:bg-primary-500 text-white rounded-full p-2 shadow-lg transition-colors"
          aria-label="프로필 이미지 변경"
        >
          <CameraIcon className="w-4 h-4" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={!editable || isUploading}
      />
    </div>
  )
}
