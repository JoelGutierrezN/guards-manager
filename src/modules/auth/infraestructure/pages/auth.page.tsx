import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AuthForm } from '../components/auth-form.component'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-brand-mid">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-size-[60px_60px]" />
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-cream">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cream/10 backdrop-blur-sm flex items-center justify-center border border-cream/20">
                  <HugeiconsIcon icon={PackageIcon} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-semibold tracking-tight">ETTS</span>
              </div>
            </div>

            <div className="space-y-8">
              <h1 className="font-serif text-5xl xl:text-6xl leading-tight tracking-tight text-balance">
                Gestión óptima de tu inventario
              </h1>
              <p className="text-lg xl:text-xl text-cream/80 max-w-md leading-relaxed">
                Transforma la gestión de tu almacén con soluciones inteligentes y eficientes.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cream/5 blur-3xl" />
          <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-brand-soft blur-2xl" />
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
