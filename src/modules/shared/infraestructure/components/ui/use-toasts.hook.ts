import { type JSX, createElement, useCallback, useState } from 'react'
import { ToastHost } from './toast-host.component'

interface ToastEntry {
  id: string
  message: string
}

export function useToasts(): readonly [addToast: (message: string) => void, toastHost: JSX.Element] {
  const [items, setItems] = useState<ToastEntry[]>([])

  const addToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setItems((previous) => [...previous, { id, message }])
    setTimeout(() => {
      setItems((previous) => previous.filter((entry) => entry.id !== id))
    }, 3000)
  }, [])

  const toastHost = createElement(ToastHost, { items })

  return [addToast, toastHost] as const
}
