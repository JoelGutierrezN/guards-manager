import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AuthForm } from '../components/auth-form.component'

export default function AuthPage() {
  return (
    <main className="min-h-svh bg-bg-app p-4 text-ink sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-[1440px] overflow-hidden rounded-[28px] border border-hairline bg-cream sm:min-h-[calc(100svh-3rem)] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden flex-col justify-between border-r border-lavender-line bg-lavender-bg p-10 lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-brand/15 bg-white/70 text-brand">
              <HugeiconsIcon icon={PackageIcon} size={24} strokeWidth={1.5} />
            </span>
            <span className="text-xl font-semibold tracking-tight">ETTS</span>
          </div>
          <div className="my-16 max-w-lg">
            <p className="mb-6 font-mono text-[10px] tracking-[0.2em] text-brand uppercase">
              Inventario y resguardos
            </p>
            <h1 className="m-0 font-display text-[clamp(48px,5vw,76px)] leading-[0.98] tracking-[-0.035em] text-balance">
              Cada herramienta,
              <br />
              <span className="text-brand italic">en buenas manos.</span>
            </h1>
            <p className="mt-7 max-w-sm text-[14px] leading-7 text-ink-3">
              Un espacio para organizar tu inventario y dar seguimiento a los bienes que acompañan
              el trabajo de tu equipo.
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-brand/10 pt-6">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            <p className="m-0 font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">
              Orden en cada entrega
            </p>
          </div>
        </section>
        <AuthForm />
      </div>
    </main>
  )
}
