import { type JSX } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface Props {
  icon: IconSvgElement
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ icon, size = 16, strokeWidth = 1.8, className }: Props): JSX.Element {
  return (
    <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={cn(className)} />
  )
}
