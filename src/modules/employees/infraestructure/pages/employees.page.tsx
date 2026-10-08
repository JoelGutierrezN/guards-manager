import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import {
  AlertIcon,
  Download01Icon,
  HierarchyFilesIcon,
  PlusSignIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons'
import { KpiCard } from '../../../shared/infraestructure/components/ui/kpi-card.tsx'
import type { Employee } from '../../domain/employee.entity'
import type { CreateEmployeeInput } from '../../domain/employee-input.model'
import { EmployeeLifecycleTextsHelper } from '../../application/employee-lifecycle-texts.helper'
import { EmployeesTable } from '../components/employees-table.component'
import { EmployeeFormModal } from '../components/employee-form-modal.component'
import { EmployeeLifecycleDialog } from '../components/employee-lifecycle-dialog.component'
import { useNavigationToast } from '../../../shared/hooks/use-navigation-toast.hook'
import { useEmployees } from '../../hooks/use-employees.hook'
import { useEmployeeLifecycle } from '../../hooks/use-employee-lifecycle.hook'

export const EmployeesPage = (): JSX.Element => {
  const {
    state,
    kpis,
    reloadList,
    applyRowUpdate,
    setPage,
    setQuery,
    clearQuery,
    setFilters,
    clearFilters,
    exportEmployees,
    openCreate,
    openEdit,
    saveEmployee,
    editingEmployee,
    modalKey,
    modalOpen,
    closeModal,
  } = useEmployees()
  const [addToast, ToastHost] = useToasts()
  const navigate = useNavigate()

  useNavigationToast(addToast)

  const lifecycle = useEmployeeLifecycle({
    onStatusChanged: (updated) => {
      applyRowUpdate(updated)
      reloadList()
      addToast(EmployeeLifecycleTextsHelper.statusChangedToast(updated.status), 'success')
    },
    onDeleted: (target) => {
      reloadList()
      addToast(EmployeeLifecycleTextsHelper.deletedToast(target.name), 'success')
    },
  })

  const handleSave = async (input: CreateEmployeeInput): Promise<void> => {
    const message = await saveEmployee(input)
    if (message != null) addToast(message)
  }

  const handleExport = async (): Promise<void> => {
    const { message, succeeded } = await exportEmployees()
    addToast(message, succeeded ? 'success' : 'error')
  }

  const handleOpenFile = (employee: Employee): void => {
    navigate(`/personal/${employee.id}`)
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
              <Button
                icon={Download01Icon}
                size="md"
                disabled={state.exporting}
                onClick={() => void handleExport()}
              >
                {state.exporting ? 'Exportando…' : 'Exportar'}
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
          leading="con alertas"
          icon={AlertIcon}
        />
      </div>

      <EmployeesTable
        rows={state.rows}
        status={state.status}
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
        onEdit={openEdit}
        onOpen={handleOpenFile}
        onChangeStatus={lifecycle.openStatusConfirm}
        onDelete={lifecycle.openDeleteConfirm}
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

      <EmployeeLifecycleDialog
        target={lifecycle.target}
        confirmKind={lifecycle.confirmKind}
        loading={lifecycle.loading}
        errorMessage={lifecycle.errorMessage}
        onConfirm={() => void lifecycle.confirm()}
        onClose={lifecycle.closeConfirm}
      />

      {ToastHost}
    </div>
  )
}
