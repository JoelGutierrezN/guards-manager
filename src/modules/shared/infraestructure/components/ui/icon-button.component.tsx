import { type ButtonHTMLAttributes, type JSX, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconSvgElement
  tip?: string
  size?: 'sm' | 'md'
  bordered?: boolean
  danger?: boolean
}

export function IconButton({
  icon,
  tip,
  size = 'md',
  bordered = false,
  danger = false,
  className,
  ...rest
}: Props): JSX.Element {
  const iconSize = size === 'sm' ? 14 : 16

  const buttonClassName = useMemo(
    () =>
      cn(
        'inline-flex cursor-pointer items-center justify-center rounded-[14px] border border-transparent bg-transparent text-ink-2 transition-[background,border-color,color]',
        size === 'sm' ? 'h-[26px] w-[26px] rounded-[10px]' : 'h-8 w-8',
        bordered && 'border-hairline-strong bg-white',
        bordered && 'hover:border-ink-3',
        !bordered && !danger && 'hover:bg-brand-soft hover:text-ink',
        danger && 'hover:bg-danger-soft hover:text-danger',
        className,
      ),
    [size, bordered, danger, className],
  )

  const button = (
    <button type="button" className={buttonClassName} {...rest}>
      <HugeiconsIcon icon={icon} size={iconSize} strokeWidth={1.8} />
    </button>
  )

  if (!tip) return button

  return (
    <span className="relative inline-flex [&:hover_.tip-label]:opacity-100 [&:hover_.tip-label]:translate-y-1">
      {button}
      <span
        className="tip-label pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 translate-y-0 rounded-[10px] bg-ink px-2 py-1 text-[11px] font-medium whitespace-nowrap text-cream opacity-0 transition-[opacity,transform] z-50"
        style={{ marginBottom: '6px' }}
      >
        {tip}
      </span>
    </span>
  )
}
