import { type JSX } from 'react'
import { Skeleton } from '../../../shared/infraestructure/components/ui'
import { DashboardCell } from './dashboard-cell.component'

export function DashboardSkeleton(): JSX.Element {
  return (
    <div className="mt-6 grid grid-cols-6 gap-3.5">
      <DashboardCell variant="accent" span={2} rowSpan={2} label="Cargando resguardos activos">
        <Skeleton shape="text" width="60%" />
        <Skeleton shape="block" height="72px" />
        <Skeleton shape="text" width="80%" />
      </DashboardCell>

      <DashboardCell span={4} rowSpan={2} label="Cargando actividad semanal">
        <Skeleton shape="text" width="40%" />
        <Skeleton shape="block" height="180px" />
      </DashboardCell>

      <DashboardCell span={6} label="Cargando actividad reciente">
        <Skeleton shape="text" width="30%" />
        <Skeleton shape="block" height="120px" />
      </DashboardCell>
    </div>
  )
}
