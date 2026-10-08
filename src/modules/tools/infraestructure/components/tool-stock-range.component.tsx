import { type JSX, useMemo } from 'react'

interface Props {
  value: [number, number]
  min: number
  max: number
  onChange: (range: [number, number]) => void
}

export function ToolStockRange({ value, min, max, onChange }: Props): JSX.Element {
  const [low, high] = value

  const activeTrackStyle = useMemo(() => {
    const span = max - min || 1
    const leftPercent = ((low - min) / span) * 100
    const rightPercent = ((high - min) / span) * 100
    return { left: `${leftPercent}%`, right: `${100 - rightPercent}%` }
  }, [low, high, min, max])

  const highLabel = high >= max ? `${max}+` : `${high}`

  const handleLowChange = (next: number) => onChange([Math.min(next, high), high])
  const handleHighChange = (next: number) => onChange([low, Math.max(next, low)])

  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>{low}</span>
        <span>{highLabel}</span>
      </div>
      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cream-2" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand"
          style={activeTrackStyle}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          onChange={(event) => handleLowChange(Number(event.target.value))}
          className="tools-range__input"
          aria-label="Stock mínimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          onChange={(event) => handleHighChange(Number(event.target.value))}
          className="tools-range__input"
          aria-label="Stock máximo"
        />
      </div>
    </div>
  )
}
