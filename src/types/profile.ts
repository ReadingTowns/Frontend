export interface ProfileImageUploadResponse {
  uploadUrl: string
}

export interface ProfileUpdateRequest {
  nickname?: string
  availableTime?: string
  profileImage?: string
}

export interface ImageCompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  initialQuality?: number
}

export interface ProfileImageUploadProgress {
  stage:
    | 'idle'
    | 'validating'
    | 'compressing'
    | 'uploading'
    | 'updating'
    | 'success'
    | 'error'
  progress: number // 0-100
  message?: string
}
