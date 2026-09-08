import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import {
  ClipboardIcon,
  PackageDeliveredIcon,
  PackageOpenIcon,
  PlusSignIcon,
  Task01Icon,
} from '@hugeicons/core-free-icons'
import { Button, PageHero } from '../../../shared/infraestructure/components/ui'
import { KpiCard } from '../../../shared/infraestructure/components/ui/kpi-card'
import type { Custody } from '../../domain/custody.entity'
import { useCustodies } from '../../hooks/use-custodies.hook'
import { CustodiesTable } from '../components/custodies-table.component'

const NEW_ASSIGNMENT_PATH = '/newAssignment'

export function CustodiesPage(): JSX.Element {
  const { state, kpis, reloadList, setPage, setQuery, clearQuery, setFilters, clearFilters } =
    useCustodies()
  const navigate = useNavigate()

  const handleOpenCustody = (custody: Custody): void => {
    void navigate(`/assignments/${custody.id}`)
  }

  const goToNewAssignment = (): void => {
    void navigate(NEW_ASSIGNMENT_PATH)
  }

  return (
    <div>
      <PageHero
        eyebrow="Operación · Resguardos"
        title="Resguardos activos"
        italic="activos"
        lede={kpis.lede}
        actions={
          <Button variant="primary" icon={PlusSignIcon} size="md" onClick={goToNewAssignment}>
            Nueva asignación
          </Button>
        }
      />

      <div className="mb-2 flex w-full flex-wrap items-center justify-start gap-2">
        <KpiCard title="Resguardos totales" quantity={kpis.total} icon={ClipboardIcon} />
        <KpiCard
          title="Activos"
          quantity={kpis.active}
          variant="primary"
          leading={kpis.activePercent}
          icon={Task01Icon}
        />
        <KpiCard title="Parcialmente devueltos" quantity={kpis.partial} icon={PackageOpenIcon} />
        <KpiCard title="Devueltos" quantity={kpis.returned} icon={PackageDeliveredIcon} />
      </div>

      <CustodiesTable
        rows={state.rows}
        status={state.status}
        error={state.error}
        query={state.query}
        filters={state.filters}
        page={state.page}
        lastPage={state.lastPage}
        total={state.total}
        onQueryChange={setQuery}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        onSetPage={setPage}
        onReload={reloadList}
        onClearQuery={clearQuery}
        onOpen={handleOpenCustody}
      />
    </div>
  )
}
