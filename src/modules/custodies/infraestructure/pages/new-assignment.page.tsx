import { type JSX, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PageHero, Stepper, useToasts } from '../../../shared/infraestructure/components/ui'
import { NewAssignmentCartHelper } from '../../application/new-assignment-cart.helper'
import { useNewAssignment } from '../../hooks/use-new-assignment.hook'
import { useNewAssignmentUnits } from '../../hooks/use-new-assignment-units.hook'
import { NewAssignmentCart } from '../components/new-assignment/new-assignment-cart.component'
import { NewAssignmentConfirmStep } from '../components/new-assignment/new-assignment-confirm-step.component'
import { NewAssignmentEmployeeStep } from '../components/new-assignment/new-assignment-employee-step.component'
import { NewAssignmentErrorNotice } from '../components/new-assignment/new-assignment-error-notice.component'
import { NewAssignmentFooter } from '../components/new-assignment/new-assignment-footer.component'
import { NewAssignmentSuccess } from '../components/new-assignment/new-assignment-success.component'
import { NewAssignmentUnitsStep } from '../components/new-assignment/new-assignment-units-step.component'
import { NewAssignmentErrorHelper } from '../helpers/new-assignment-error.helper'
import { NewAssignmentNavigationHelper } from '../helpers/new-assignment-navigation.helper'

const EMPLOYEE_HELP = 'Elige un empleado activo para continuar.'
const UNITS_HELP = 'Agrega al menos una unidad al resguardo.'

export function NewAssignmentPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()
  const {
    state,
    steps,
    canContinue,
    canSubmit,
    loadEmployeeOptions,
    selectEmployee,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    addUnits,
    removeUnit,
    clearCart,
    setItemCondition,
    setItemNotes,
    setNotes,
    restart,
    submit,
  } = useNewAssignment()
  const units = useNewAssignmentUnits()

  const cartStockIds = useMemo(() => NewAssignmentCartHelper.stockIds(state.cart), [state.cart])
  const isSubmitting = state.status === 'submitting'
  const isDone = state.status === 'done'

  const helpMessage = useMemo(() => {
    if (canContinue) return null
    if (state.stepId === 'employee') return EMPLOYEE_HELP
    return UNITS_HELP
  }, [canContinue, state.stepId])

  const handleAddUnits = useCallback(() => {
    addUnits(units.selectedStocks)
    units.clearSelection()
  }, [addUnits, units])

  const handleSubmit = useCallback(async (): Promise<void> => {
    const custody = await submit()
    if (custody === null) return
    addToast(`Resguardo ${custody.code} creado.`)
  }, [submit, addToast])

  const handleViewCustody = useCallback(() => {
    if (state.createdCustody === null) return
    void navigate(NewAssignmentNavigationHelper.custodyPath(state.createdCustody.id))
  }, [navigate, state.createdCustody])

  const handleNewAssignment = useCallback(() => {
    restart()
    units.reset()
  }, [restart, units])

  return (
    <div className="mx-auto w-full max-w-300">
      <PageHero
        eyebrow="Operación · resguardos"
        title="Nueva asignación"
        italic="asignación"
        lede="Entrega herramientas a un empleado en tres pasos: elige a quién, marca las unidades y confirma."
      />

      <div className="reveal-d2 mt-5 flex flex-col gap-4">
        <Stepper steps={steps} currentStepId={state.stepId} onSelect={goToStep} />

        {isDone && state.createdCustody !== null ? (
          <NewAssignmentSuccess
            custody={state.createdCustody}
            onViewCustody={handleViewCustody}
            onNewAssignment={handleNewAssignment}
          />
        ) : (
          <>
            {state.stepId === 'employee' && (
              <NewAssignmentEmployeeStep
                employee={state.employee}
                isLoading={state.isEmployeeLoading}
                errorMessage={state.error?.fieldErrors.employee}
                loadOptions={loadEmployeeOptions}
                onSelect={selectEmployee}
              />
            )}

            {state.stepId === 'units' && (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
                <NewAssignmentUnitsStep
                  units={units.state}
                  cartStockIds={cartStockIds}
                  loadProductOptions={units.loadProductOptions}
                  onSelectProduct={units.selectProduct}
                  onConsecutiveChange={units.setConsecutive}
                  onPageChange={units.setPage}
                  onSelectionChange={units.setSelectedIds}
                  onAdd={handleAddUnits}
                  onRetry={units.retry}
                />
                <NewAssignmentCart items={state.cart} onRemove={removeUnit} onClear={clearCart} />
              </div>
            )}

            {state.stepId === 'confirm' && (
              <NewAssignmentConfirmStep
                employee={state.employee}
                items={state.cart}
                notes={state.notes}
                error={state.error}
                disabled={isSubmitting}
                onItemConditionChange={setItemCondition}
                onItemNotesChange={setItemNotes}
                onRemoveItem={removeUnit}
                onNotesChange={setNotes}
              />
            )}

            {state.error !== null && (
              <NewAssignmentErrorNotice
                message={state.error.message}
                reasons={NewAssignmentErrorHelper.noticeReasons(state.error)}
              />
            )}

            <NewAssignmentFooter
              stepId={state.stepId}
              canContinue={canContinue}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              helpMessage={helpMessage}
              onBack={goToPreviousStep}
              onContinue={goToNextStep}
              onSubmit={() => void handleSubmit()}
            />
          </>
        )}
      </div>

      {toastHost}
    </div>
  )
}
