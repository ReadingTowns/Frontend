import toast from 'react-hot-toast'

/**
 * 중복 방지 toast - 메시지를 ID로 사용하여 같은 메시지는 업데이트만 됨
 *
 * @param message - 표시할 메시지
 * @param options - 추가 옵션 (icon, duration 등)
 * @returns toast ID
 *
 * @example
 * showToast('저장되었습니다')
 * showToast('처리 중...', { icon: '⏳', duration: 5000 })
 */
export const showToast = (
  message: string,
  options?: {
    icon?: string
    duration?: number
  }
) => {
  return toast(message, {
    id: message, // 메시지를 ID로 사용 - 중복 방지
    ...options,
  })
}

/**
 * 성공 toast - 중복 방지 기능 포함
 *
 * @param message - 성공 메시지
 * @param options - 추가 옵션
 * @returns toast ID
 *
 * @example
 * showSuccess('로그인 성공!')
 * showSuccess('저장되었습니다', { duration: 2000 })
 */
export const showSuccess = (
  message: string,
  options?: {
    duration?: number
  }
) => {
  return toast.success(message, {
    id: `success-${message}`,
    ...options,
  })
}

/**
 * 경고 toast - 중복 방지 기능 포함
 *
 * @param message - 경고 메시지
 * @param options - 추가 옵션
 * @returns toast ID
 *
 * @example
 * showWarning('연결 상태를 확인해주세요')
 * showWarning('입력값을 확인해주세요', { duration: 4000 })
 */
export const showWarning = (
  message: string,
  options?: {
    duration?: number
  }
) => {
  return toast(message, {
    icon: '⚠️',
    id: `warning-${message}`,
    ...options,
  })
}

/**
 * 에러 toast - 중복 방지 기능 포함
 *
 * @param message - 에러 메시지
 * @param options - 추가 옵션
 * @returns toast ID
 *
 * @example
 * showError('로그인 실패')
 * showError('네트워크 오류가 발생했습니다', { duration: 5000 })
 */
export const showError = (
  message: string,
  options?: {
    duration?: number
  }
) => {
  return toast.error(message, {
    id: `error-${message}`,
    ...options,
  })
}

/**
 * 카테고리별 toast - 같은 카테고리의 toast는 업데이트됨
 *
 * @param category - 카테고리 ID (같은 카테고리는 하나만 표시됨)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 * @returns toast ID
 *
 * @example
 * // 네트워크 상태 toast - 여러 번 호출해도 하나만 표시됨
 * showCategoryToast('network', '연결 중...', { icon: '🔄' })
 * showCategoryToast('network', '연결되었습니다', { icon: '✅' })
 *
 * // 업로드 진행 상태 - 같은 카테고리로 업데이트됨
 * showCategoryToast('upload', '업로드 중... 10%')
 * showCategoryToast('upload', '업로드 중... 50%')
 * showCategoryToast('upload', '업로드 완료!', { icon: '✅' })
 */
export const showCategoryToast = (
  category: string,
  message: string,
  options?: {
    icon?: string
    duration?: number
  }
) => {
  return toast(message, {
    id: category,
    ...options,
  })
}
