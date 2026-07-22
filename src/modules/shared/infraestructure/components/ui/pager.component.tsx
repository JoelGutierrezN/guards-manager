import { type JSX } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface PagerProps {
  page: number
  lastPage: number
  total: number
  onChange: (page: number) => void
  itemsLabel?: string
}

const ELLIPSIS = '…' as const
const VISIBLE_CELLS = 7

function buildPages(page: number, max: number): (number | typeof ELLIPSIS)[] {
  if (max <= VISIBLE_CELLS) {
    return Array.from({ length: max }, (_, index) => index + 1)
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, ELLIPSIS, max]
  }
  if (page >= max - 3) {
    return [1, ELLIPSIS, max - 4, max - 3, max - 2, max - 1, max]
  }
  return [1, ELLIPSIS, page - 1, page, page + 1, ELLIPSIS, max]
}

export function Pager({
  page,
  lastPage,
  total,
  onChange,
  itemsLabel = 'elementos',
}: PagerProps): JSX.Element | null {
  if (lastPage <= 1) return null

  const max = Math.max(1, lastPage)
  const pages = buildPages(page, max)

  const cell =
    'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-[8px] px-1.5 text-[12px] font-medium tabular-nums text-ink-2 transition-[background,color] duration-[120ms]'

  return (
    <div className="mt-5 flex items-center justify-between text-[13px] text-muted">
      <span>
        Página <b className="text-ink">{page}</b> de {lastPage} · {total} {itemsLabel}
      </span>

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
              className={cn(cell, p === page ? 'bg-ink text-white' : 'hover:bg-brand-soft')}
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
    </div>
  )
}
