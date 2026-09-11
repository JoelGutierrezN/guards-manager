import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft01Icon,
  Delete02Icon,
  Download01Icon,
  PencilEdit02Icon,
  SentIcon,
  UserBlock01Icon,
  UserCheck01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import { NavigationToastHelper } from '../../../shared/application/navigation-toast.helper'
import type { EmployeeFileDamage } from '../../domain/employee-file-damage.model'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import type { UpdateEmployeeInput } from '../../domain/employee-input.model'
import { EmployeeStatusHelper } from '../../application/employee-status.helper'
import { EmployeeLifecycleTextsHelper } from '../../application/employee-lifecycle-texts.helper'
import { useEmployeeFile } from '../../hooks/use-employee-file.hook'
import { useEmployeeLifecycle } from '../../hooks/use-employee-lifecycle.hook'
import { EmployeeFormModal } from '../components/employee-form-modal.component'
import { EmployeeLifecycleDialog } from '../components/employee-lifecycle-dialog.component'
import { EmployeeFileError } from '../components/employee-file-error.component'
import { EmployeeFileIdentityCard } from '../components/employee-file-identity-card.component'
import { EmployeeFilePanel } from '../components/employee-file-panel.component'
import { EmployeeFileSkeleton } from '../components/employee-file-skeleton.component'
import { EmployeeFileSummaryCard } from '../components/employee-file-summary-card.component'

const EMPLOYEES_PATH = '/personal'
const NEW_ASSIGNMENT_PATH = '/newAssignment'
const INACTIVE_EMPLOYEE_TIP = 'El empleado está dado de baja'

export function EmployeeFilePage(): JSX.Element {
  const {
    state,
    reload,
    setTab,
    toggleItem,
    toggleAllItems,
    clearSelection,
    downloadPdf,
    downloadDocument,
    downloadDamageSheet,
    tabItems,
    selectionCount,
    allSelected,
    someSelected,
    heroEyebrow,
    heroTitle,
    heroItalic,
    heroLede,
    modalOpen,
    modalKey,
    editingEmployee,
    saving,
    formError,
    openEdit,
    closeModal,
    saveEmployee,
  } = useEmployeeFile()
  const [addToast, ToastHost] = useToasts()
  const navigate = useNavigate()

  const goToEmployees = (): void => {
    void navigate(EMPLOYEES_PATH)
  }

  const lifecycle = useEmployeeLifecycle({
    onStatusChanged: (updated) => {
      reload()
      addToast(EmployeeLifecycleTextsHelper.statusChangedToast(updated.status), 'success')
    },
    // El expediente deja de existir: el aviso se muestra ya en el listado.
    onDeleted: (target) => {
      void navigate(EMPLOYEES_PATH, {
        state: NavigationToastHelper.stateFor(
          EmployeeLifecycleTextsHelper.deletedToast(target.name),
        ),
      })
    },
  })

  const handleDownloadPdf = async (): Promise<void> => {
    const { message, succeeded } = await downloadPdf()
    addToast(message, succeeded ? 'success' : 'error')
  }

  const handleDownloadDocument = async (fileDocument: EmployeeFileDocument): Promise<void> => {
    const { message, succeeded } = await downloadDocument(fileDocument)
    addToast(message, succeeded ? 'success' : 'error')
  }

  const handleDownloadDamageSheet = async (damage: EmployeeFileDamage): Promise<void> => {
    const { message, succeeded } = await downloadDamageSheet(damage)
    addToast(message, succeeded ? 'success' : 'error')
  }

  const handleSave = async (input: UpdateEmployeeInput): Promise<void> => {
    const message = await saveEmployee(input)
    if (message != null) addToast(message)
  }

  // El anfitrión de avisos se mantiene montado también mientras el expediente recarga:
  // si no, el toast de "dado de baja" moriría con el esqueleto que dispara `reload()`.
  if (state.status === 'loading') {
    return (
      <>
        <EmployeeFileSkeleton />
        {ToastHost}
      </>
    )
  }

  if (state.status === 'error' || state.file === null) {
    return (
      <>
        <EmployeeFileError message={state.error} onRetry={reload} onBack={goToEmployees} />
        {ToastHost}
      </>
    )
  }

  const profile = state.file.employee
  const employeeId = profile.id
  const isActiveEmployee = EmployeeStatusHelper.isActive(profile.status)

  const goToNewAssignment = (): void => {
    void navigate(`${NEW_ASSIGNMENT_PATH}?employeeId=${employeeId}`)
  }

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <button
        type="button"
        onClick={goToEmployees}
        className="reveal-d1 mb-3 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-ink"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} /> Volver a Personal
      </button>

      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        italic={heroItalic}
        lede={heroLede}
        actions={
          <>
            <Button
              icon={Download01Icon}
              size="md"
              disabled={state.downloadingPdf}
              onClick={() => void handleDownloadPdf()}
            >
              {state.downloadingPdf ? 'Generando…' : 'PDF expediente'}
            </Button>
            <Button icon={PencilEdit02Icon} size="md" onClick={openEdit}>
              Editar
            </Button>
            <Button
              icon={isActiveEmployee ? UserBlock01Icon : UserCheck01Icon}
              size="md"
              onClick={() => lifecycle.openStatusConfirm(profile)}
            >
              {isActiveEmployee ? 'Dar de baja' : 'Reactivar'}
            </Button>
            <Button
              icon={Delete02Icon}
              size="md"
              onClick={() => lifecycle.openDeleteConfirm(profile)}
            >
              Eliminar
            </Button>
            <Button
              variant="primary"
              icon={SentIcon}
              size="md"
              disabled={!isActiveEmployee}
              tip={isActiveEmployee ? undefined : INACTIVE_EMPLOYEE_TIP}
              onClick={goToNewAssignment}
            >
              Nueva asignación
            </Button>
          </>
        }
      />

      <div className="reveal-d2 mt-4 grid grid-cols-[280px_1fr] gap-4 max-[1100px]:grid-cols-1">
        <div className="flex flex-col gap-3">
          <EmployeeFileIdentityCard employee={profile} alerts={state.file.alerts} />
          <EmployeeFileSummaryCard summary={state.file.summary} />
        </div>

        <EmployeeFilePanel
          file={state.file}
          tab={state.tab}
          tabItems={tabItems}
          selectedItemIds={state.selectedItemIds}
          selectionCount={selectionCount}
          allSelected={allSelected}
          someSelected={someSelected}
          onTabChange={setTab}
          onToggleItem={toggleItem}
          onToggleAll={toggleAllItems}
          onClearSelection={clearSelection}
          onDownloadDocument={(fileDocument) => void handleDownloadDocument(fileDocument)}
          onDownloadDamageSheet={(damage) => void handleDownloadDamageSheet(damage)}
        />
      </div>

      <EmployeeFormModal
        key={modalKey}
        open={modalOpen}
        editEmployee={editingEmployee}
        saving={saving}
        formError={formError}
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
