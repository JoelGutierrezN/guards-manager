import { type JSX } from 'react'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import {
  AlertIcon,
  Download01Icon,
  HierarchyFilesIcon,
  PlusSignIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons'
import { KpiCard } from '../../../shared/infraestructure/components/ui/kpi-card.tsx'
import type { CreateEmployeeInput } from '../../domain/employee-input.model'
import { EmployeesTable } from '../components/employees-table.component'
import { EmployeeFormModal } from '../components/employee-form-modal.component'
import { useEmployees } from '../../hooks/use-employees.hook'

export const EmployeesPage = (): JSX.Element => {
  const {
    state,
    kpis,
    reloadList,
    setPage,
    setQuery,
    clearQuery,
    openCreate,
    openEdit,
    saveEmployee,
    editingEmployee,
    modalKey,
    modalOpen,
    closeModal,
  } = useEmployees()
  const [addToast, ToastHost] = useToasts()

  const handleSave = async (input: CreateEmployeeInput): Promise<void> => {
    const message = await saveEmployee(input)
    if (message != null) addToast(message)
  }

  return (
    <div>
      <PageHero
        eyebrow="Personal · Directorio"
        title="Personal operativo"
        italic="operativo"
        lede={kpis.lede}
        actions={
          <div className="reveal d2 mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {/* TODO API: descargar GET /employees/export con los filtros activos. */}
              <Button icon={Download01Icon} size="md">
                Exportar
              </Button>
              <Button variant="primary" icon={PlusSignIcon} size="md" onClick={openCreate}>
                Nuevo empleado
              </Button>
            </div>
          </div>
        }
      />

      <div className="w-full flex items-center justify-start gap-2 mb-2">
        <KpiCard title="Activos totales" quantity={kpis.total} icon={UserMultipleIcon} />
        <KpiCard
          title="Con asignaciones"
          quantity={kpis.withActiveTools}
          variant="primary"
          leading={kpis.assignedPercent}
          icon={HierarchyFilesIcon}
        />
        <KpiCard
          title="Requieren atención"
          quantity={kpis.withAlerts}
          leading="vencidos"
          icon={AlertIcon}
        />
      </div>

      <EmployeesTable
        rows={state.rows}
        status={state.status}
        query={state.query}
        page={state.page}
        lastPage={state.lastPage}
        total={state.total}
        onQueryChange={setQuery}
        onSetPage={setPage}
        onReload={reloadList}
        onClearQuery={clearQuery}
        onEdit={openEdit}
      />

      <EmployeeFormModal
        key={modalKey}
        open={modalOpen}
        editEmployee={editingEmployee}
        saving={state.saving}
        formError={state.formError}
        onClose={closeModal}
        onSave={(input) => void handleSave(input)}
      />

      {ToastHost}
    </div>
  )
}
