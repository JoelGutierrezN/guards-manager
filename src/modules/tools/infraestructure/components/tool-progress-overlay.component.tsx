import { type JSX, useEffect, useState } from 'react'
import type { Tool } from '../../domain/tool.entity'

interface Props {
  total: number
  tool: Tool | null
  onDone: () => void
}

export function ToolProgressOverlay({ total, tool, onDone }: Props): JSX.Element {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let current = 0
    const intervalId = setInterval(() => {
      current += Math.random() * 16 + 7
      if (current >= 100) {
        current = 100
        setPercent(100)
        clearInterval(intervalId)
        setTimeout(onDone, 550)
      } else {
        setPercent(current)
      }
    }, 230)
    return () => clearInterval(intervalId)
  }, [onDone])

  const processedCount = Math.min(total, Math.round((percent / 100) * total))
  const unitLabel = total === 1 ? 'unidad' : 'unidades'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: 'rgba(5, 10, 26, 0.5)',
        backdropFilter: 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
      }}
    >
      <div className="flex w-[360px] flex-col items-center gap-4 rounded-[24px] bg-white px-[30px] py-[34px] shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)]">
        <div className="tools-spinner" style={{ width: 30, height: 30 }} />
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
            Registrando ingreso…
          </div>
          <div className="text-[13px] text-muted">
            {processedCount} de {total} {unitLabel}
            {tool ? ` · ${tool.name}` : ''}
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="font-mono text-[11px] text-muted">{Math.round(percent)}%</div>
      </div>
    </div>
  )
}
