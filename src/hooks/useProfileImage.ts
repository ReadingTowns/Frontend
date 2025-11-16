import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  compressImage,
  isValidImageSize,
  isValidImageType,
  shouldCompressImage,
} from '@/lib/imageCompression'
import type { ProfileImageUploadResponse } from '@/types/profile'

interface UseProfileImageUploadReturn {
  uploadProfileImage: (file: File) => Promise<string>
  isUploading: boolean
  progress: number
  error: Error | null
}

/**
 * Hook for uploading profile images
 *
 * Flow:
 * 1. Validate file (type, size)
 * 2. Compress image if needed (>1MB)
 * 3. Get presigned upload URL from backend
 * 4. Upload binary file to S3
 * 5. Return S3 URL for profile update
 */
export function useProfileImageUpload(): UseProfileImageUploadReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      // Step 1: Validate file type
      if (!isValidImageType(file)) {
        throw new Error('JPEG, PNG, WebP 형식의 이미지만 업로드 가능합니다.')
      }

      // Step 2: Validate file size (5MB max)
      if (!isValidImageSize(file, 5)) {
        throw new Error('5MB 이하의 이미지만 업로드 가능합니다.')
      }

      // Step 3: Compress image if needed (>1MB)
      let fileToUpload = file
      if (shouldCompressImage(file, 1)) {
        try {
          fileToUpload = await compressImage(file)
        } catch (error) {
          console.error('Compression failed, uploading original:', error)
          // If compression fails, continue with original file
        }
      }

      // Step 4: Get presigned upload URL from backend
      const { uploadUrl } = await api.patch<ProfileImageUploadResponse>(
        '/api/v1/members/me/profile-image'
      )

      if (!uploadUrl) {
        throw new Error('업로드 URL을 받아오지 못했습니다.')
      }

      // Step 5: Upload binary file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileToUpload.type,
        },
        body: fileToUpload,
      })

      if (!uploadResponse.ok) {
        throw new Error('S3 업로드에 실패했습니다.')
      }

      // Step 6: Extract S3 URL (remove query parameters)
      const s3Url = uploadUrl.split('?')[0]

      return s3Url
    },
    onSuccess: () => {
      // Invalidate profile queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return {
    uploadProfileImage: mutation.mutateAsync,
    isUploading: mutation.isPending,
    progress: mutation.isPending ? 50 : 0, // Simple progress indicator
    error: mutation.error,
  }
}
