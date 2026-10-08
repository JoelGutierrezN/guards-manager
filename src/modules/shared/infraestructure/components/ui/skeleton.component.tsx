import { type CSSProperties, type JSX, useMemo } from 'react'
import { cn } from '../../utils/cn'
import type { SkeletonShape } from './skeleton.model'

interface Props {
  shape?: SkeletonShape
  width?: string
  height?: string
  className?: string
}

const SHAPE_CLASS_NAMES: Record<SkeletonShape, string> = {
  text: 'h-3 w-full rounded-full',
  block: 'h-16 w-full rounded-[16px]',
  circle: 'h-10 w-10 rounded-full',
}

export function Skeleton({ shape = 'text', width, height, className }: Props): JSX.Element {
  const skeletonClassName = useMemo(
    () => cn('animate-pulse bg-cream-2', SHAPE_CLASS_NAMES[shape], className),
    [shape, className],
  )

  const inlineStyle = useMemo<CSSProperties | undefined>(() => {
    if (!width && !height) return undefined
    return { width, height }
  }, [width, height])

  return <span aria-hidden="true" className={cn('block', skeletonClassName)} style={inlineStyle} />
}
