import { type JSX, createElement, useCallback, useState } from 'react'
import { ToastHost } from './toast-host.component'
import type { ToastEntry, ToastTone } from './toast.model'

export function useToasts(): readonly [
  addToast: (message: string, tone?: ToastTone) => void,
  toastHost: JSX.Element,
] {
  const [items, setItems] = useState<ToastEntry[]>([])

  const addToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = crypto.randomUUID()
    setItems((previous) => [...previous, { id, message, tone }])
    setTimeout(() => {
      setItems((previous) => previous.filter((entry) => entry.id !== id))
    }, 3000)
  }, [])

  const toastHost = createElement(ToastHost, { items })

  return [addToast, toastHost] as const
}
