import { type JSX, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { PackageAddIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button, PageHero } from '../../../shared/infraestructure/components/ui'
import type { DashboardCriticalStockItem } from '../../domain/dashboard-critical-stock-item.model'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'
import type { DashboardRecentActivity } from '../../domain/dashboard-recent-activity.model'
import { useDashboard } from '../../hooks/use-dashboard.hook'
import { DashboardNavigationHelper } from '../helpers/dashboard-navigation.helper'
import { DashboardErrorNotice } from '../components/dashboard-error-notice.component'
import { DashboardOverviewGrid } from '../components/dashboard-overview-grid.component'
import { DashboardSkeleton } from '../components/dashboard-skeleton.component'

export function DashboardPage(): JSX.Element {
  const { state, kpiCards, chart, lede, reload } = useDashboard()
  const navigate = useNavigate()

  const goTo = useCallback(
    (path: string) => {
      void navigate(path)
    },
    [navigate],
  )

  const goToAssignments = useCallback(() => goTo(DashboardNavigationHelper.custodiesPath()), [goTo])

  const goToNewAssignment = useCallback(
    () => goTo(DashboardNavigationHelper.newAssignmentPath()),
    [goTo],
  )

  const goToStockIn = useCallback(() => goTo(DashboardNavigationHelper.stockInPath()), [goTo])

  const openActivity = useCallback(
    (activity: DashboardRecentActivity) =>
      goTo(DashboardNavigationHelper.custodyPath(activity.custodyId)),
    [goTo],
  )

  const signPending = useCallback(
    (signature: DashboardPendingSignature) =>
      goTo(DashboardNavigationHelper.signaturePath(signature)),
    [goTo],
  )

  const openProduct = useCallback(
    (item: DashboardCriticalStockItem) =>
      goTo(DashboardNavigationHelper.productSearchPath(item.name)),
    [goTo],
  )

  return (
    <div>
      <PageHero
        eyebrow="Panel · Resumen"
        title="Panel general de operación"
        italic="general"
        lede={lede}
        actions={
          <>
            <Button icon={PackageAddIcon} onClick={goToStockIn}>
              Ingreso
            </Button>
            <Button variant="primary" icon={PlusSignIcon} onClick={goToNewAssignment}>
              Nueva asignación
            </Button>
          </>
        }
      />

      {state.status === 'loading' && <DashboardSkeleton />}

      {state.status === 'error' && state.error !== null && (
        <DashboardErrorNotice message={state.error} onRetry={reload} />
      )}

      {state.status === 'ready' && state.overview !== null && (
        <DashboardOverviewGrid
          overview={state.overview}
          kpiCards={kpiCards}
          chart={chart}
          onViewAssignments={goToAssignments}
          onOpenActivity={openActivity}
          onSignPending={signPending}
          onOpenProduct={openProduct}
        />
      )}
    </div>
  )
}
