import { type JSX, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BentoVariant = 'default' | 'accent' | 'dark' | 'cream' | 'lavender'

interface BentoCellProps {
  variant?: BentoVariant
  span?: 1 | 2 | 3 | 4 | 5 | 6
  rowSpan?: 1 | 2 | 3
  selectable?: boolean
  selected?: boolean
  className?: string
  onClick?: () => void
  children: ReactNode
}

const SPAN: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
}

const ROW_SPAN: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
}

const VARIANT: Record<BentoVariant, string> = {
  default: 'border-hairline bg-white',
  accent: 'bento-cell--accent text-white',
  dark: 'bento-cell--dark text-cream',
  cream: 'bento-cell--cream',
  lavender: 'bento-cell--lavender',
}

export function BentoCell({
  variant = 'default',
  span = 2,
  rowSpan = 1,
  selectable,
  selected,
  className,
  onClick,
  children,
}: BentoCellProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bento-cell relative flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden rounded-[32px] border p-5',
        SPAN[span],
        ROW_SPAN[rowSpan],
        VARIANT[variant],
        selectable && 'cursor-pointer',
        selected && '[outline:2px_solid_var(--color-brand)] [outline-offset:-2px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
