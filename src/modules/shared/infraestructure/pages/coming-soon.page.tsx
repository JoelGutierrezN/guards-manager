import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { Layers01Icon } from '@hugeicons/core-free-icons'
import { Empty } from '../components/ui'
import { Button } from '../components/ui'

export function ComingSoonPage(): JSX.Element {
  const navigate = useNavigate()

  return (
    <Empty
      icon={Layers01Icon}
      title="Pantalla en construcción"
      body="Esta sección aún no está disponible. Estamos trabajando en ella y pronto podrás acceder a su contenido."
      action={
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Volver al panel
        </Button>
      }
    />
  )
}
