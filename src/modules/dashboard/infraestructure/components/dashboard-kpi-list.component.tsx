import { type JSX } from 'react'
import type { DashboardKpiCard } from '../../application/dashboard-kpi-card.model'
import { DashboardKpiCell } from './dashboard-kpi-cell.component'

interface Props {
  cards: DashboardKpiCard[]
}

export function DashboardKpiList({ cards }: Props): JSX.Element {
  return (
    <>
      {cards.map((card) => (
        <DashboardKpiCell key={card.key} card={card} />
      ))}
    </>
  )
}
