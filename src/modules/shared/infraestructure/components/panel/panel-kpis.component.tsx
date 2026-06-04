import { type JSX } from 'react'
import {
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  CornerDownRightIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { BentoCell } from './bento-cell.component'
import { AnimatedNumber } from './animated-number.component'
import { Eyebrow } from './panel-bits.component'
import type { KpiKey } from './panel.data'

interface PanelKpisProps {
  selected: KpiKey
  onSelect: (key: KpiKey) => void
}
export function PanelKpis({ selected, onSelect }: PanelKpisProps): JSX.Element {
  return (
    <>
      <BentoCell
        variant="accent"
        span={2}
        rowSpan={2}
        selectable
        selected={selected === 'open'}
        onClick={() => onSelect('open')}
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] font-medium tracking-[0.22em] text-white/70 uppercase">
            Activas hoy
          </div>
          <span className="text-white/85">
            <HugeiconsIcon icon={CornerDownRightIcon} size={22} strokeWidth={1.8} />
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="font-display text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.035em]">
            <AnimatedNumber value={798} />
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase">
            asignaciones abiertas
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap gap-2">
          <AccentPill>
            <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_0_3px_var(--color-ok-soft)]" />
            +24 vs. sem.
          </AccentPill>
          <AccentPill>62% inventario</AccentPill>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-white/70">
          <span>Tendencia 14 d</span>
          <a className="inline-flex items-center gap-1.5 font-medium text-white">
            Ver detalle <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.8} />
          </a>
        </div>

        <span className="panel-bubble pointer-events-none absolute -top-2 -right-1 rounded-[26px] px-3.5 py-2 text-[12px] font-medium tracking-[-0.01em] text-ink-2">
          Pico 11:00
        </span>
        <span className="panel-bubble pointer-events-none absolute top-[42%] -left-3 rounded-[26px] px-3.5 py-2 text-[12px] font-medium tracking-[-0.01em] text-ink-2">
          +24 vs sem
        </span>
      </BentoCell>

      <BentoCell
        span={2}
        selectable
        selected={selected === 'avail'}
        onClick={() => onSelect('avail')}
      >
        <Eyebrow>Disponibles</Eyebrow>
        <KpiStat value={412} label="listas para asignar" />
        <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-muted">
          <span>32% del inventario</span>
          <span className="text-brand">
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} />
          </span>
        </div>
      </BentoCell>

      <BentoCell
        variant="cream"
        span={2}
        selectable
        selected={selected === 'mtto'}
        onClick={() => onSelect('mtto')}
      >
        <div className="flex items-center justify-between">
          <Eyebrow>Mantenimiento</Eyebrow>
          <span className="inline-flex items-center gap-1 text-[11px] text-ok">
            <HugeiconsIcon icon={ArrowUp01Icon} size={11} strokeWidth={1.8} /> +4
          </span>
        </div>
        <KpiStat value={52} label="en servicio técnico" />
        <div className="mt-auto flex items-center justify-between gap-3 text-[12px] text-muted">
          <span>Promedio 18 d</span>
          <span className="text-brand">
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} />
          </span>
        </div>
      </BentoCell>
    </>
  )
}

function KpiStat({ value, label }: { value: number; label: string }): JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[44px] leading-none font-normal tracking-[-0.035em] text-ink [font-feature-settings:'tnum']">
        <AnimatedNumber value={value} />
      </div>
      <div className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{label}</div>
    </div>
  )
}

function AccentPill({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full border border-white/25 bg-white/20 px-[9px] font-mono text-[11px] font-medium tracking-[0.04em] whitespace-nowrap text-white">
      {children}
    </span>
  )
}
