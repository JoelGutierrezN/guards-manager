import { type JSX } from 'react'
import { Mail01Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { EmployeeContactHelper } from '../helpers/employee-contact.helper'

interface Props {
  email: string | null
  phone: string | null
}

const LINK_CLASS_NAME =
  'inline-flex min-w-0 items-center gap-1.5 text-[12px] text-ink-2 transition-colors hover:text-brand hover:underline'

export function EmployeeContactCell({ email, phone }: Props): JSX.Element {
  if (email == null && phone == null) {
    return <span className="text-[13px] text-muted-soft">—</span>
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {email != null && (
        <a href={EmployeeContactHelper.mailtoUrl(email)} className={LINK_CLASS_NAME} title={email}>
          <HugeiconsIcon icon={Mail01Icon} size={13} strokeWidth={1.8} className="shrink-0" />
          <span className="truncate">{email}</span>
        </a>
      )}
      {phone != null && (
        <a
          href={EmployeeContactHelper.whatsappUrl(phone)}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS_NAME}
          title="Abrir chat de WhatsApp"
        >
          <HugeiconsIcon icon={WhatsappIcon} size={13} strokeWidth={1.8} className="shrink-0" />
          <span className="truncate font-mono">{phone}</span>
        </a>
      )}
    </div>
  )
}
