import { type ButtonHTMLAttributes, type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { Variant, Size } from './button.model'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: IconSvgElement
  iconRight?: IconSvgElement
  tip?: string
}

const SIZES: Record<Size, string> = {
  sm: 'h-7 gap-1.5 px-2 text-[12px]',
  md: 'h-[34px] gap-2 px-4 text-[13px]',
  lg: 'h-[42px] gap-2 px-4 text-[14px]',
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_4px_10px_-2px_rgba(111,78,242,0.4)] bg-[linear-gradient(160deg,var(--color-brand-mid),var(--color-brand)_55%,var(--color-brand-hover))] hover:bg-[linear-gradient(160deg,var(--color-brand),var(--color-brand-hover)_60%,var(--color-brand-active))] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_16px_-2px_rgba(111,78,242,0.5)]',
  secondary:
    'border-lavender-line bg-white text-ink hover:border-brand-mid hover:bg-[#f5f5fd] hover:text-brand-active',
  ghost: 'text-ink-2 hover:bg-brand-soft hover:text-ink',
  danger:
    'bg-danger text-white border-transparent hover:bg-[#a52f23] shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  tip,
  className,
  children,
  ...rest
}: Props): JSX.Element {
  const button = (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent font-semibold tracking-[-0.005em] whitespace-nowrap transition-[background,border-color,color,transform,box-shadow] select-none active:translate-y-[0.5px] disabled:pointer-events-none disabled:opacity-50',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {icon && <HugeiconsIcon icon={icon} size={14} strokeWidth={1.8} />}
      {children}
      {iconRight && <HugeiconsIcon icon={iconRight} size={14} strokeWidth={1.8} />}
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
