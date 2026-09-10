import { type JSX, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import { useReturn } from '../../hooks/use-return.hook'
import { ReturnErrorNotice } from '../components/return/return-error-notice.component'
import { ReturnFooter } from '../components/return/return-footer.component'
import { ReturnItemsTable } from '../components/return/return-items-table.component'
import { ReturnLoadError } from '../components/return/return-load-error.component'
import { ReturnNotesField } from '../components/return/return-notes-field.component'
import { ReturnSkeleton } from '../components/return/return-skeleton.component'
import { ReturnSuccess } from '../components/return/return-success.component'
import { ReturnSummaryCard } from '../components/return/return-summary-card.component'
import { ReturnErrorHelper } from '../helpers/return-error.helper'
import { ReturnNavigationHelper } from '../helpers/return-navigation.helper'

const NO_SELECTION_HELP = 'Marca al menos una unidad para continuar.'

export function CustodyReturnPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()
  const {
    state,
    pendingItems,
    hero,
    previewType,
    canSubmit,
    blockedMessage,
    isNotFound,
    reload,
    setSelectedStockIds,
    setItemCondition,
    setItemNotes,
    setNotes,
    submit,
  } = useReturn()

  const { custody, createdReturn } = state

  const goToCustodies = useCallback(() => {
    void navigate(ReturnNavigationHelper.custodiesPath())
  }, [navigate])

  const goToCustody = useCallback(() => {
    if (custody === null) return
    void navigate(ReturnNavigationHelper.custodyPath(custody.id))
  }, [navigate, custody])

  const goToEmployeeFile = useCallback(() => {
    const employeeId =
      createdReturn?.employeeId ?? createdReturn?.employee?.id ?? custody?.employee.id ?? null
    if (employeeId === null) return
    void navigate(ReturnNavigationHelper.employeeFilePath(employeeId))
  }, [navigate, createdReturn, custody])

  const handleSubmit = useCallback(async (): Promise<void> => {
    const registeredReturn = await submit()
    if (registeredReturn === null) return
    addToast(`Devolución ${registeredReturn.code} registrada.`)
  }, [submit, addToast])

  if (state.status === 'loading') return <ReturnSkeleton />

  if (state.status === 'error' || custody === null) {
    return (
      <ReturnLoadError
        message={state.loadError}
        notFound={isNotFound}
        onRetry={reload}
        onBack={goToCustodies}
      />
    )
  }

  const isSubmitting = state.status === 'submitting'
  const isDone = state.status === 'done' && createdReturn !== null

  if (!isDone && blockedMessage !== null) {
    return (
      <ReturnLoadError
        message={blockedMessage}
        notFound={false}
        onRetry={reload}
        onBack={goToCustodies}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-300">
      <PageHero
        eyebrow="Operación · devoluciones"
        title={hero.title}
        italic={hero.italic}
        lede={hero.lede}
      />

      <div className="reveal-d2 mt-5 flex flex-col gap-4">
        {isDone && createdReturn !== null ? (
          <ReturnSuccess
            createdReturn={createdReturn}
            onViewCustody={goToCustody}
            onViewEmployeeFile={goToEmployeeFile}
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
              <div className="flex min-w-0 flex-col gap-4">
                <ReturnItemsTable
                  items={pendingItems}
                  drafts={state.drafts}
                  selectedStockIds={state.selectedStockIds}
                  itemErrors={state.error?.itemErrors ?? {}}
                  disabled={isSubmitting}
                  onSelectionChange={setSelectedStockIds}
                  onConditionChange={setItemCondition}
                  onNotesChange={setItemNotes}
                />
                <ReturnNotesField
                  notes={state.notes}
                  errorMessage={state.error?.fieldErrors.notes}
                  disabled={isSubmitting}
                  onChange={setNotes}
                />
              </div>

              <ReturnSummaryCard
                employee={custody.employee}
                custodyCode={custody.code}
                previewType={previewType}
                selectedCount={state.selectedStockIds.length}
                pendingCount={pendingItems.length}
              />
            </div>

            {state.error !== null && (
              <ReturnErrorNotice
                message={state.error.message}
                reasons={ReturnErrorHelper.noticeReasons(state.error)}
              />
            )}

            <ReturnFooter
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              helpMessage={
                !isSubmitting && state.selectedStockIds.length === 0 ? NO_SELECTION_HELP : null
              }
              onBack={goToCustody}
              onSubmit={() => void handleSubmit()}
            />
          </>
        )}
      </div>

      {toastHost}
    </div>
  )
}
