import { type JSX } from 'react'
import { Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button } from '../ui'

const formatToday = (): string => {
  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return today.charAt(0).toUpperCase() + today.slice(1)
}

export function PanelHero(): JSX.Element {
  return (
    <section className="mb-5 flex flex-col gap-5 border-b border-hairline pt-8 pb-6">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-brand uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_4px_var(--color-brand-soft)]" />
          {formatToday()}
        </div>
        <h1 className="m-0 font-display text-[clamp(40px,4.8vw,64px)] leading-[0.96] font-normal tracking-[-0.035em] text-balance text-ink">
          Panel <em className="text-brand italic">general</em> de blindajes
        </h1>
      </div>
      <div>
        <p className="m-0 mb-4 max-w-[36ch] text-[14px] leading-[1.55] text-ink-3">
          1,284 herramientas activas. 7 alertas requieren tu atención hoy. Movimiento estable
          últimas 2 semanas.
        </p>
        <div className="flex gap-2">
          <Button icon={Download01Icon}>Exportar</Button>
          <Button variant="primary" icon={PlusSignIcon}>
            Nueva asignación
          </Button>
        </div>
      </div>
    </section>
  )
}
