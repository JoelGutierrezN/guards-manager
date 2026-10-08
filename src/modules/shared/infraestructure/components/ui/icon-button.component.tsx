import { type ButtonHTMLAttributes, type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'

type Size = 'sm' | 'md'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconSvgElement
  tip?: string
  size?: Size
  bordered?: boolean
  danger?: boolean
}

const SIZES: Record<Size, string> = {
  sm: 'h-[26px] w-[26px] rounded-[10px]',
  md: 'h-8 w-8 rounded-[14px]',
}

export function IconButton({
  icon,
  tip,
  size = 'md',
  bordered,
  danger,
  className,
  ...rest
}: IconButtonProps): JSX.Element {
  const button = (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border border-transparent text-ink-2 transition-[background,color,border-color] duration-[120ms]',
        SIZES[size],
        bordered
          ? 'border-hairline-strong bg-white hover:border-ink-3'
          : 'bg-transparent hover:bg-brand-soft hover:text-ink',
        danger && 'hover:bg-danger-soft hover:text-danger',
        className,
      )}
      {...rest}
    >
      <HugeiconsIcon icon={icon} size={size === 'sm' ? 14 : 16} strokeWidth={1.8} />
    </button>
  )

  if (!tip) return button

  return (
    <span className="group/tip relative inline-flex">
      {button}
      <span className="pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-0.5 rounded-[10px] bg-ink px-2 py-1 text-[11px] font-medium whitespace-nowrap text-cream opacity-0 transition-[opacity,transform] duration-[120ms] group-hover/tip:translate-y-1 group-hover/tip:opacity-100">
        {tip}
      </span>
    </span>
  )
}
