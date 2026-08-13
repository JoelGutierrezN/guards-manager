import { Empty } from '../ui'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { Button } from '@heroui/react'
import { useMemo } from 'react'

interface Props {
  hasError: boolean
  onReload: () => void
}

export const TableEmptyContent = ({ hasError = false, onReload }: Props) => {
  const leading = useMemo(() => {
    return hasError
      ? 'Ocurrió un error intenta reintentar la carga de datos'
      : 'Parece que aun no cuentas con datos, realizar tu primer registro para comenzar'
  }, [hasError])

  return (
    <tr>
      <td colSpan={6} className="border-b border-hairline lg:h-125">
        <Empty
          icon={PackageIcon}
          title="No hay datos que mostrar"
          body={leading}
          action={
            <Button onPress={onReload} variant="outline">
              Reintentar
            </Button>
          }
        />
      </td>
    </tr>
  )
}
