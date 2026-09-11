import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Empty, PageHero, Skeleton, useToasts } from '../../../shared/infraestructure/components/ui'
import { useAccountMe } from '../../hooks/use-account-me.hook'
import { AccountProfileForm } from '../components/account-profile-form.component'
import { AccountPasswordForm } from '../components/account-password-form.component'
import { AccountProfileHeader } from '../components/account-profile-header.component'

export function ProfilePage(): JSX.Element {
  const { profile, status, setProfile } = useAccountMe()
  const [addToast, toastHost] = useToasts()

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-6">
      <PageHero eyebrow="Cuenta" title="Mi perfil" lede="Actualiza tus datos y tu contraseña." />

      {status === 'loading' && (
        <div className="flex flex-col gap-3">
          <Skeleton shape="block" className="h-16 w-full" />
          <Skeleton shape="block" className="h-40 w-full" />
        </div>
      )}

      {status === 'error' && (
        <Empty
          icon={Alert02Icon}
          title="No se pudo cargar tu perfil"
          body="Intenta recargar la página."
        />
      )}

      {profile !== null && (
        <>
          <section className="rounded-[20px] border border-hairline bg-white p-6">
            <AccountProfileHeader profile={profile} />
          </section>

          <section className="rounded-[20px] border border-hairline bg-white p-6">
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Datos de la cuenta</h2>
            <AccountProfileForm profile={profile} onSaved={setProfile} onNotify={addToast} />
          </section>

          <section className="rounded-[20px] border border-hairline bg-white p-6">
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Cambiar contraseña</h2>
            <AccountPasswordForm onNotify={addToast} />
          </section>
        </>
      )}

      {toastHost}
    </div>
  )
}
