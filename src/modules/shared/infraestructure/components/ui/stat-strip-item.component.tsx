import { type JSX, memo, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { StatStripEntry } from './stat-strip.model'

interface StatStripItemProps {
  entry: StatStripEntry
}

const TONE_CLASSES: Record<NonNullable<StatStripEntry['tone']>, string> = {
  accent:
    'bg-[linear-gradient(160deg,var(--color-brand-mid)_0%,var(--color-brand)_100%)] border-transparent text-white shadow-[0_14px_32px_-10px_rgba(39,40,113,0.45)]',
  lavender: 'bg-lavender-bg border-lavender-line',
  cream: 'bg-cream border-[rgba(26,19,38,0.06)]',
  dark: 'bg-[linear-gradient(155deg,#221735_0%,#14091f_100%)] border-[rgba(255,255,255,0.06)] text-white',
}

function StatStripItemInner({ entry }: StatStripItemProps): JSX.Element {
  const cardClassName = useMemo(
    () =>
      cn(
        'flex items-center gap-2.5 rounded-[20px] border p-3 transition-[border-color,box-shadow] hover:shadow-[0_2px_6px_-1px_rgba(14,15,60,0.06),0_1px_2px_rgba(14,15,60,0.03)]',
        entry.tone
          ? TONE_CLASSES[entry.tone]
          : 'bg-white border-hairline hover:border-lavender-line',
      ),
    [entry.tone],
  )

  const isAccentOrDark = entry.tone === 'accent' || entry.tone === 'dark'

  const tileClassName = useMemo(
    () =>
      cn(
        'grid h-8 w-8 shrink-0 place-items-center rounded-[10px]',
        isAccentOrDark ? 'bg-white/20 text-white' : 'bg-lavender-bg text-brand',
      ),
    [isAccentOrDark],
  )

  const labelClassName = useMemo(
    () =>
      cn(
        'font-mono text-[9px] font-medium uppercase tracking-[0.16em] mb-[3px]',
        isAccentOrDark ? 'text-white/70' : 'text-muted',
      ),
    [isAccentOrDark],
  )

  const valueClassName = useMemo(
    () =>
      cn(
        'text-[22px] font-medium leading-none tracking-[-0.025em] [font-feature-settings:"tnum"]',
        isAccentOrDark ? 'text-white' : 'text-ink',
      ),
    [isAccentOrDark],
  )

  const deltaClassName = useMemo(
    () =>
      cn(
        'font-mono text-[11px]',
        entry.deltaTone === 'up'
          ? 'text-ok'
          : entry.deltaTone === 'down'
            ? 'text-danger'
            : isAccentOrDark
              ? 'text-white/70'
              : 'text-muted',
      ),
    [entry.deltaTone, isAccentOrDark],
  )

  return (
    <div className={cardClassName}>
      {entry.icon && (
        <span className={tileClassName}>
          <HugeiconsIcon icon={entry.icon} size={14} strokeWidth={1.8} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className={labelClassName}>{entry.label}</div>
        <div className="flex items-baseline gap-2">
          <div className={valueClassName}>{entry.value}</div>
          {entry.delta && <span className={deltaClassName}>{entry.delta}</span>}
        </div>
      </div>
    </div>
  )
}

export const StatStripItem = memo(StatStripItemInner)
