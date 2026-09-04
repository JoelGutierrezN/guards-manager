import { type JSX } from 'react'
import { Toast } from './toast.component'
import type { ToastTone } from './toast.model'

interface ToastEntry {
  id: string
  message: string
  tone: ToastTone
}

interface Props {
  items: ToastEntry[]
}

export function ToastHost({ items }: Props): JSX.Element {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      {items.map((entry) => (
        <div key={entry.id} className="pointer-events-auto">
          <Toast message={entry.message} tone={entry.tone} />
        </div>
      ))}
    </div>
  )
}
