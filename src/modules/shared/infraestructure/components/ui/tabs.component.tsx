import { type JSX } from 'react'
import { cn } from '../../utils/cn'

interface TabItem<T extends string> {
  value: T
  label: string
  /** Contador opcional mostrado como burbuja a la derecha del rótulo. */
  count?: number
}

interface TabsProps<T extends string> {
  value: T
  items: TabItem<T>[]
  onChange: (value: T) => void
}

/** Pestañas con subrayado y contador opcional. Fiel al `.tabs` del diseño. */
export function Tabs<T extends string>({ value, items, onChange }: TabsProps<T>): JSX.Element {
  return (
    <div className="flex gap-0.5 border-b border-hairline">
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              '-mb-px inline-flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] font-medium transition-[color,border-color]',
              active
                ? 'border-brand text-ink'
                : 'border-transparent text-muted hover:text-ink-2',
            )}
          >
            <span>{item.label}</span>
            {item.count != null && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums',
                  active ? 'bg-brand-soft-2 text-brand' : 'bg-cream-2 text-ink-3',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
