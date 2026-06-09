import { type JSX } from 'react'
import {CornerDownRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FEATURES } from './panel.data'

export function PanelFeatures(): JSX.Element {
  return (
    <div className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      {FEATURES.map((feat) => (
        <article
          key={feat.title}
          className="flex flex-col gap-3 rounded-[26px] border border-hairline bg-white p-5"
        >
          <span className="text-brand">
            <HugeiconsIcon icon={CornerDownRight} size={22} strokeWidth={1.8} />
          </span>
          <h3 className="m-0 text-[18px] font-medium tracking-[-0.015em] text-ink">
            {feat.title}
          </h3>
          <p className="m-0 text-[12px] leading-[1.55] text-ink-3">{feat.body}</p>
        </article>
      ))}
    </div>
  )
}
