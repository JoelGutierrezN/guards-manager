import { type JSX, useMemo } from 'react'
import type { ToastTone } from './toast.model'
import { ToastToneHelper } from './toast-tone.helper'

interface Props {
  message: string
  tone?: ToastTone
}

export function Toast({ message, tone = 'success' }: Props): JSX.Element {
  const dotClassName = useMemo(
    () => `h-2 w-2 shrink-0 rounded-full ${ToastToneHelper.dotClassNameFor(tone)}`,
    [tone],
  )

  return (
    <div
      className="flex min-w-[220px] max-w-[360px] items-center gap-2.5 rounded-[14px] bg-ink px-3.5 py-2.5 text-[12px] font-medium text-cream shadow-[0_18px_38px_-10px_rgba(14,15,60,0.16),0_6px_14px_-4px_rgba(14,15,60,0.08)]"
      style={{ animation: 'toast-in 320ms cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <span className={dotClassName} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
