export type ToastTone = 'success' | 'error' | 'info'

export interface ToastEntry {
  id: string
  message: string
  tone: ToastTone
}
