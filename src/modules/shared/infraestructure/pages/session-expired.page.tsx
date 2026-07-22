import { type JSX } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { LockIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '../components/ui'
import type { FromLocationState } from '../../../auth/infraestructure/from-location-state.interfaces'

export function SessionExpiredPage(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as FromLocationState | null

  if (!state?.from) {
    return <Navigate to="/" replace />
  }

  const from = state.from

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-[0_0_0_4px_var(--color-brand-soft)]">
          <HugeiconsIcon icon={LockIcon} size={26} strokeWidth={1.8} />
        </div>
        <div className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-brand uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_4px_var(--color-brand-soft)]" />
          Sesión
        </div>

        <h1 className="m-0 mb-3 font-display text-[clamp(28px,3vw,38px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink">
          Tu sesión expiró
        </h1>

        <p className="mx-auto mb-8 max-w-[42ch] text-[13px] leading-[1.6] text-ink-3">
          Por seguridad cerramos tu sesión tras un periodo de inactividad. Vuelve a iniciar sesión para continuar donde lo dejaste.
        </p>

        <Button variant="primary" size="lg" onClick={() => navigate('/', { state: { from } })}>
          Iniciar sesión
        </Button>
      </div>
    </div>
  )
}
