import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn.ts'

type Variant = 'primary' | 'default'

const VARIANT_CLASSNAMES: Record<Variant, string> = {
  primary:
    'bg-[linear-gradient(160deg,var(--color-brand-mid),var(--color-brand)_55%,var(--color-brand-hover))] hover:bg-[linear-gradient(160deg,var(--color-brand),var(--color-brand-hover)_60%,var(--color-brand-active))]',
  default: 'bg-white',
}

const ICON_WRAPPER_CLASSNAMES: Record<Variant, string> = {
  primary: 'bg-white/15',
  default: '',
}

const TEXT_CLASSNAMES: Record<Variant, string> = {
  primary: 'text-white',
  default: 'text-ink',
}

const NOTATION_CLASSNAMES: Record<Variant, string> = {
  primary: 'text-white',
  default: 'text-muted',
}

interface Props {
  variant?: Variant
  icon: IconSvgElement
  title: string
  quantity: string | number
  leading?: string
}

export const KpiCard = ({ variant = 'default', icon, title, quantity, leading }: Props) => {
  return (
    <div
      className={cn(
        'shadow rounded-2xl hover:shadow-lg',
        'transition-all duration-300 w-69.5 h-16.5 flex px-4 py-2 gap-5 items-center',
        VARIANT_CLASSNAMES[variant],
      )}
    >
      <div
        className={cn(
          'size-9 rounded-lg bg-ink-3/10 p-2 flex justify-center items-center',
          ICON_WRAPPER_CLASSNAMES[variant],
        )}
      >
        <HugeiconsIcon icon={icon} className={cn('size-4.5 text-ink', TEXT_CLASSNAMES[variant])} />
      </div>
      <div className="flex flex-col justify-center h-full">
        <h6 className={cn('font-mono text-[10px] uppercase', NOTATION_CLASSNAMES[variant])}>
          {title}
        </h6>
        <div className="flex items-end gap-2">
          <span
            className={cn('font-mono font-medium text-[20px] leading-6', TEXT_CLASSNAMES[variant])}
          >
            {quantity}
          </span>
          {leading && (
            <span className={cn('text-xs leading-5', NOTATION_CLASSNAMES[variant])}>{leading}</span>
          )}
        </div>
      </div>
    </div>
  )
}
