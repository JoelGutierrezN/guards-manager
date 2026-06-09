import { type JSX, type ReactNode, memo, useMemo } from 'react'
import { cn } from '../../utils/cn'

interface PagerButtonProps {
  children: ReactNode
  isActive?: boolean
  isDisabled?: boolean
  onPress: () => void
}

function PagerButtonInner({
  isActive = false,
  isDisabled = false,
  onPress,
  children,
}: PagerButtonProps): JSX.Element {
  const buttonClassName = useMemo(
    () =>
      cn(
        'inline-flex h-7 min-w-[28px] items-center justify-center rounded-[10px] px-1.5 text-[12px] font-medium tabular-nums transition-[background,color]',
        isActive
          ? 'bg-ink text-cream'
          : 'text-ink-2 hover:bg-brand-soft',
        isDisabled && 'pointer-events-none text-muted-soft',
      ),
    [isActive, isDisabled],
  )

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={onPress}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}

export const PagerButton = memo(PagerButtonInner)
