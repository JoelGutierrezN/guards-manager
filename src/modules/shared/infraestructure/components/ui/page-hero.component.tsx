import { type JSX, type ReactNode, useMemo } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  eyebrow?: string
  title: string
  italic?: string
  lede?: string
  actions?: ReactNode
  compact?: boolean
  dense?: boolean
}

export function PageHero({
  eyebrow,
  title,
  italic,
  lede,
  actions,
  compact = false,
  dense = false,
}: Props): JSX.Element {
  const titleParts = useMemo(() => {
    if (!italic || !title.includes(italic)) return null
    const splitIndex = title.indexOf(italic)
    return {
      before: title.slice(0, splitIndex),
      highlighted: italic,
      after: title.slice(splitIndex + italic.length),
    }
  }, [title, italic])

  const heroClassName = useMemo(
    () =>
      cn(
        'grid items-end border-b border-hairline max-[1100px]:grid-cols-1',
        compact ? 'grid-cols-[1.2fr_1fr] gap-6' : 'grid-cols-[1.4fr_1fr] gap-8',
        dense ? 'pt-[5px] pb-0 mb-[5px]' : compact ? 'py-0 mb-4' : 'pt-8 pb-6 mb-5',
      ),
    [compact, dense],
  )

  return (
    <section className={heroClassName}>
      <div>
        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_4px_var(--color-brand-soft)]" />
            {eyebrow}
          </div>
        )}
        <h1
          className={cn(
            'font-display m-0 font-normal leading-[0.96] tracking-[-0.035em] text-ink text-balance',
            compact
              ? 'text-[clamp(32px,3.4vw,44px)] max-[1100px]:text-[32px]'
              : 'text-[clamp(40px,4.8vw,64px)] max-[1100px]:text-[44px]',
          )}
        >
          {titleParts ? (
            <>
              {titleParts.before}
              <em className="italic text-brand">{titleParts.highlighted}</em>
              {titleParts.after}
            </>
          ) : (
            title
          )}
        </h1>
      </div>
      {(lede || actions) && (
        <div>
          {lede && (
            <p
              className={cn(
                'mb-4 leading-[1.55] text-ink-3',
                compact ? 'max-w-[44ch] text-[12px]' : 'max-w-[36ch] text-[14px]',
              )}
            >
              {lede}
            </p>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
    </section>
  )
}
