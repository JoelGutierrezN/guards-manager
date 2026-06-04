import { type JSX } from 'react'

export function SidebarBrand(): JSX.Element {
  return (
    <div className="mx-[-4px] mb-4 flex h-11 items-center gap-2.5 px-2">
      <div className="sidebar-logo flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-[13px] font-bold tracking-[0.02em] text-white">
        E
      </div>
      <div className="group-data-[collapsed=true]/sidebar:hidden">
        <div className="whitespace-nowrap text-[14px] font-bold leading-none tracking-[-0.01em] text-ink">
          ETTS
        </div>
        <div className="mt-[3px] font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
          Blindajes
        </div>
      </div>
    </div>
  )
}
