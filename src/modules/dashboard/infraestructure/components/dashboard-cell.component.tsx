import { type JSX, type ReactNode, useMemo } from 'react'
import { cn } from '../../../shared/infraestructure/utils/cn'
import './dashboard.css'
import type {
  DashboardCellRowSpan,
  DashboardCellSpan,
  DashboardCellVariant,
} from './dashboard-cell.model'

interface Props {
  variant?: DashboardCellVariant
  span?: DashboardCellSpan
  rowSpan?: DashboardCellRowSpan
  label?: string
  className?: string
  children: ReactNode
}

const SPAN_CLASS_NAMES: Record<DashboardCellSpan, string> = {
  2: 'col-span-6 md:col-span-3 xl:col-span-2',
  3: 'col-span-6 md:col-span-3',
  4: 'col-span-6 xl:col-span-4',
  6: 'col-span-6',
}

const ROW_SPAN_CLASS_NAMES: Record<DashboardCellRowSpan, string> = {
  1: 'row-span-1',
  2: 'xl:row-span-2',
}

const VARIANT_CLASS_NAMES: Record<DashboardCellVariant, string> = {
  default: 'border-hairline bg-white',
  accent: 'dashboard-cell--accent border text-white',
  cream: 'dashboard-cell--cream border',
  lavender: 'dashboard-cell--lavender border',
}

export function DashboardCell({
  variant = 'default',
  span = 2,
  rowSpan = 1,
  label,
  className,
  children,
}: Props): JSX.Element {
  const cellClassName = useMemo(
    () =>
      cn(
        'dashboard-cell relative flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden rounded-[32px] border p-5',
        SPAN_CLASS_NAMES[span],
        ROW_SPAN_CLASS_NAMES[rowSpan],
        VARIANT_CLASS_NAMES[variant],
        className,
      ),
    [span, rowSpan, variant, className],
  )

  return (
    <article aria-label={label} className={cellClassName}>
      {children}
    </article>
  )
}
