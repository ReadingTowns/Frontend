export type SnackbarType = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarMessage {
  id: string
  message: string
  type: SnackbarType
  duration?: number
}

export interface SnackbarContextValue {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number
  ) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}
