import { type JSX } from 'react'
import { cn } from '../../utils/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'default' | 'navy'
}

const SIZES = {
  sm: 'h-[26px] w-[26px] text-[10px]',
  md: 'h-8 w-8 text-[12px]',
  lg: 'h-11 w-11 text-[14px]',
}

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '·'

/** Avatar de iniciales. */
export function Avatar({ name, size = 'md', tone = 'default' }: AvatarProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[0.02em]',
        SIZES[size],
        tone === 'navy' ? 'bg-brand text-cream' : 'bg-cream-2 text-ink-2',
      )}
    >
      {initials(name)}
    </span>
  )
}
