import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { LockIcon } from '@hugeicons/core-free-icons'
import { Button, Empty } from '../components/ui'

export function ForbiddenPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <Empty
      icon={LockIcon}
      title="Acceso denegado"
      body="No tienes permisos para ver esta página."
      action={
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Volver al panel
        </Button>
      }
    />
  )
}
