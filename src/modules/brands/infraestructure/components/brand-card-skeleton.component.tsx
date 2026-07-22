import { type JSX } from 'react'

/** Placeholder con las mismas dimensiones de `BrandCard` para recargas sin saltos de layout. */
export function BrandCardSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse overflow-hidden rounded-[26px] border border-hairline bg-white p-4.5 shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-3xl bg-cream-2" />
        <div className="min-w-0 flex-1">
          <div className="h-5 w-2/3 rounded-md bg-cream-2" />
          <div className="mt-1.5 h-3 w-1/3 rounded-md bg-cream-2" />
        </div>
      </div>

      <div className="my-3 h-px bg-hairline" />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-11 rounded-md bg-cream-2" />
        <div className="h-11 rounded-md bg-cream-2" />
      </div>

      <div className="mt-2.5 h-1 rounded-sm bg-cream-2" />
      <div className="mt-1 h-3 w-1/4 rounded-md bg-cream-2" />
    </div>
  )
}
