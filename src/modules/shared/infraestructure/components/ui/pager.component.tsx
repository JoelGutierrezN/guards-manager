import { type JSX } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface PagerProps {
  page?: number
  total?: number
  onChange: (page: number) => void
}

const ELLIPSIS = '…' as const

function buildPages(page: number, max: number): (number | typeof ELLIPSIS)[] {
  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < max)
  return [
    1,
    ...(around[0] > 2 ? [ELLIPSIS] : []),
    ...around,
    ...(around[around.length - 1] < max - 1 ? [ELLIPSIS] : []),
    ...(max > 1 ? [max] : []),
  ]
}

export function Pager({ page = 1, total = 1, onChange }: PagerProps): JSX.Element {
  const max = Math.max(1, total)
  const pages = buildPages(page, max)

  const cell =
    'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-[8px] px-1.5 text-[12px] font-medium tabular-nums text-ink-2 transition-[background,color] duration-[120ms]'

  return (
    <div className="inline-flex items-center gap-0.5">
      <button
        type="button"
        className={cn(cell, 'hover:bg-brand-soft disabled:pointer-events-none disabled:text-muted-soft')}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Página anterior"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} />
      </button>

      {pages.map((p, i) =>
        p === ELLIPSIS ? (
          <span key={`e${i}`} className={cn(cell, 'pointer-events-none text-muted-soft')}>
            {ELLIPSIS}
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(cell, p === page ? 'bg-ink text-cream' : 'hover:bg-brand-soft')}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className={cn(cell, 'hover:bg-brand-soft disabled:pointer-events-none disabled:text-muted-soft')}
        disabled={page >= max}
        onClick={() => onChange(page + 1)}
        aria-label="Página siguiente"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={1.8} />
      </button>
    </div>
  )
}
