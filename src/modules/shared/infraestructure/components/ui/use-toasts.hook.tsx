import { type JSX, type ReactNode, useCallback, useRef, useState } from 'react'

interface Toast {
  id: number
  message: string
}

type UseToastsReturn = [addToast: (message: string) => void, host: ReactNode]

/** Pila de toasts efímeros (3s). Devuelve `[addToast, ToastHost]`. */
export function useToasts(): UseToastsReturn {
  const [items, setItems] = useState<Toast[]>([])
  const seq = useRef(0)

  const addToast = useCallback((message: string) => {
    const id = seq.current++
    setItems((arr) => [...arr, { id, message }])
    setTimeout(() => {
      setItems((arr) => arr.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const host: JSX.Element = (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[200] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex min-w-[220px] max-w-[360px] items-center gap-2.5 rounded-[14px] bg-ink px-3.5 py-2.5 text-[12px] font-medium text-cream shadow-[0_18px_38px_-10px_rgba(14,15,60,0.16),0_6px_14px_-4px_rgba(14,15,60,0.08)] [animation:toast-in_320ms_cubic-bezier(0.16,1,0.3,1)]"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#5fc97a] shadow-[0_0_8px_#5fc97a]" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )

  return [addToast, host]
}
