import { type JSX, useMemo } from 'react'
import { BrandPresenter } from '../../application/brand-presenter.helper'
import type { BrandAvatarSize } from './brand-avatar.model'

const SIZE_CLASSES: Record<BrandAvatarSize, string> = {
  sm: 'h-8 w-8 rounded-2xl text-[13px]',
  md: 'h-10 w-10 rounded-[14px] text-[16px]',
  lg: 'h-11 w-11 rounded-3xl text-[18px]',
}

interface Props {
  name: string
  size?: BrandAvatarSize
}

export function BrandAvatar({ name, size = 'md' }: Props): JSX.Element {
  const logo = useMemo(
    () => ({ initial: BrandPresenter.initial(name), color: BrandPresenter.color(name) }),
    [name],
  )

  const avatarClassName = useMemo(
    () =>
      `grid shrink-0 place-items-center font-bold tracking-[0.04em] text-white ${SIZE_CLASSES[size]}`,
    [size],
  )

  return (
    <div
      className={avatarClassName}
      style={{ background: logo.color, boxShadow: `0 4px 12px -3px ${logo.color}80` }}
    >
      {logo.initial}
    </div>
  )
}
