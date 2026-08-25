import { type JSX, memo, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { TabItem } from './tabs.model'

interface Props<T extends string> {
  item: TabItem<T>
  active: boolean
  onSelect: (value: T) => void
}

const BADGE_CLASS_NAME =
  'rounded-full bg-cream-2 px-1.5 py-px text-[10px] font-semibold tracking-[0.08em] text-muted uppercase'

function TabButtonInner<T extends string>({ item, active, onSelect }: Props<T>): JSX.Element {
  const buttonClassName = useMemo(
    () =>
      cn(
        '-mb-px inline-flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] font-medium transition-[color,border-color]',
        active ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink-2',
      ),
    [active],
  )

  const countClassName = useMemo(
    () =>
      cn(
        'rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums',
        active ? 'bg-brand-soft-2 text-brand' : 'bg-cream-2 text-ink-3',
      ),
    [active],
  )

  return (
    <button type="button" className={buttonClassName} onClick={() => onSelect(item.value)}>
      {item.icon && <HugeiconsIcon icon={item.icon} size={13} strokeWidth={1.8} />}
      <span>{item.label}</span>
      {item.badge != null && <span className={BADGE_CLASS_NAME}>{item.badge}</span>}
      {item.badge == null && item.count != null && (
        <span className={countClassName}>{item.count}</span>
      )}
    </button>
  )
}

export const TabButton = memo(TabButtonInner) as typeof TabButtonInner
