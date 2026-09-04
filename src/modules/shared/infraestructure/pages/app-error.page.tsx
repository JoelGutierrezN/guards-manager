import { type JSX } from 'react'
import { useNavigate, useRouteError } from 'react-router'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '../components/ui'

export function AppErrorPage(): JSX.Element {
  const navigate = useNavigate()
  useRouteError()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger shadow-[0_0_0_4px_var(--color-danger-soft)]">
          <HugeiconsIcon icon={Alert02Icon} size={26} strokeWidth={1.8} />
        </div>
        <div className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-danger uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-danger shadow-[0_0_0_4px_var(--color-danger-soft)]" />
          Error
        </div>

        <h1 className="m-0 mb-3 font-display text-[clamp(28px,3vw,38px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink">
          Ocurrió un error inesperado
        </h1>

        <p className="mx-auto mb-8 max-w-[42ch] text-[13px] leading-[1.6] text-ink-3">
          Algo falló al cargar esta página. Puedes volver al panel e intentarlo de nuevo.
        </p>

        <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
          Volver al panel
        </Button>
      </div>
    </div>
  )
}
