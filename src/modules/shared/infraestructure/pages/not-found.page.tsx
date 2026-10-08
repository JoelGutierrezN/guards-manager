import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { Button, Empty } from '../components/ui'

export function NotFoundPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <Empty
      icon={AlertCircleIcon}
      title="Página no encontrada"
      body="La página que buscas no existe o fue movida."
      action={
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Volver al panel
        </Button>
      }
    />
  )
}
