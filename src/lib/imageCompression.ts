import imageCompression from 'browser-image-compression'

export interface ImageCompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  initialQuality?: number
}

const DEFAULT_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: 0.5, // 500KB target
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  initialQuality: 0.8,
}

/**
 * Compress image file to reduce size while maintaining quality
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  try {
    const compressedFile = await imageCompression(file, mergedOptions)
    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    throw new Error('이미지 압축에 실패했습니다.')
  }
}

/**
 * Validate image file type
 * @param file - File to validate
 * @returns true if valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Validate image file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 5MB)
 * @returns true if file size is valid
 */
export function isValidImageSize(file: File, maxSizeMB = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Check if image should be compressed
 * @param file - File to check
 * @param thresholdMB - Size threshold in MB (default: 1MB)
 * @returns true if file should be compressed
 */
export function shouldCompressImage(file: File, thresholdMB = 1): boolean {
  const thresholdBytes = thresholdMB * 1024 * 1024
  return file.size > thresholdBytes
}
