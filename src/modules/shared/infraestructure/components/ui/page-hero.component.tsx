import { type JSX, type ReactNode } from 'react'

interface PageHeroProps {
  eyebrow?: string
  title: string
  italic?: string
  lede?: string
  actions?: ReactNode
}

function renderTitle(title: string, italic?: string): ReactNode {
  if (!italic || !title.includes(italic)) return title
  const [before, ...rest] = title.split(italic)
  return (
    <>
      {before}
      <em className="text-brand italic">{italic}</em>
      {rest.join(italic)}
    </>
  )
}

/** Cabecera de página compacta, coherente con el `PageHero` del diseño. */
export function PageHero({
  eyebrow,
  title,
  italic,
  lede,
  actions,
}: PageHeroProps): JSX.Element {
  return (
    <section className="reveal-d1 mb-4 grid grid-cols-1 items-end gap-6 border-b border-hairline py-1 lg:grid-cols-[1.2fr_1fr]">
      <div>
        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-brand uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_4px_var(--color-brand-soft)]" />
            {eyebrow}
          </div>
        )}
        <h1 className="m-0 font-display text-[clamp(32px,3.4vw,44px)] leading-[0.96] font-normal tracking-[-0.035em] text-balance text-ink">
          {renderTitle(title, italic)}
        </h1>
      </div>
      {(lede || actions) && (
        <div>
          {lede && (
            <p className="m-0 mb-4 max-w-[44ch] text-[12px] leading-[1.55] text-ink-3">
              {lede}
            </p>
          )}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
    </section>
  )
}
