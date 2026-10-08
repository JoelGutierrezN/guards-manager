import { Spinner } from '@heroui/react'

interface Props {
  width: number
}

export const TableLoader = ({ width }: Props) => {
  return (
    <tr>
      <td colSpan={width} className="border-b border-hairline lg:h-125">
        <div className="flex flex-col items-center justify-center gap-2">
          <Spinner color="current" />
          <span className="text-muted text-sm">Cargando datos espera por favor...</span>
        </div>
      </td>
    </tr>
  )
}
