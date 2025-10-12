/**
 * Snackbar Hook
 *
 * Context API 기반 전역 스낵바 시스템
 * alert() 대체용 비차단 알림 컴포넌트
 *
 * @example
 * ```tsx
 * import { useSnackbar } from '@/hooks/useSnackbar'
 *
 * function MyComponent() {
 *   const { showSuccess, showError, showWarning, showInfo } = useSnackbar()
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await api.post('/data')
 *       showSuccess('저장되었습니다!')
 *     } catch (error) {
 *       showError('저장에 실패했습니다.')
 *     }
 *   }
 *
 *   return <button onClick={handleSubmit}>저장</button>
 * }
 * ```
 */

export { useSnackbar } from '@/contexts/SnackbarContext'
