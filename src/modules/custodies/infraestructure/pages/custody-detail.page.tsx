import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Download01Icon,
  PackageDeliveredIcon,
  SignatureIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import type { CustodyReturnSummary } from '../../domain/custody.entity'
import { CustodyPresenter } from '../../application/custody-presenter.helper'
import { useCustodyDetail } from '../../hooks/use-custody-detail.hook'
import { useSheetDownload } from '../../hooks/use-sheet-download.hook'
import { SheetPathHelper } from '../helpers/sheet-path.helper'
import { SignNavigationHelper } from '../helpers/sign-navigation.helper'
import { CustodyCancelDialog } from '../components/custody-cancel-dialog.component'
import { CustodyDetailError } from '../components/custody-detail-error.component'
import { CustodyDetailSkeleton } from '../components/custody-detail-skeleton.component'
import { CustodyEmployeeCard } from '../components/custody-employee-card.component'
import { CustodyItemsTable } from '../components/custody-items-table.component'
import { CustodyReturnsPanel } from '../components/custody-returns-panel.component'
import { CustodySummaryCard } from '../components/custody-summary-card.component'

const CUSTODIES_PATH = '/assignments'
const NO_PENDING_ITEMS_TIP = 'No quedan unidades pendientes de devolución'
const CLOSED_CUSTODY_TIP = 'Este resguardo está cancelado'
const DRAFT_SHEET_TIP = 'Sin firma se descarga un borrador con la marca «SIN FIRMA»'

export function CustodyDetailPage(): JSX.Element {
  const {
    state,
    hero,
    canCancel,
    isNotFound,
    reload,
    openCancelDialog,
    closeCancelDialog,
    confirmCancel,
  } = useCustodyDetail()
  const [addToast, ToastHost] = useToasts()
  const { downloading, download } = useSheetDownload()
  const navigate = useNavigate()

  const goToCustodies = (): void => {
    void navigate(CUSTODIES_PATH)
  }

  const handleConfirmCancel = async (): Promise<void> => {
    const message = await confirmCancel()
    if (message != null) addToast(message)
  }

  if (state.status === 'loading') return <CustodyDetailSkeleton />

  const { custody } = state

  if (state.status === 'error' || custody === null) {
    return (
      <CustodyDetailError
        message={state.error}
        notFound={isNotFound}
        onRetry={reload}
        onBack={goToCustodies}
      />
    )
  }

  const goToReturn = (): void => {
    void navigate(`${CUSTODIES_PATH}/${custody.id}/return`)
  }

  const goToSign = (): void => {
    void navigate(SignNavigationHelper.custodySignPath(custody.id))
  }

  const handleDownloadSheet = async (): Promise<void> => {
    const outcome = await download(
      SheetPathHelper.custodyTarget(custody.id, custody.code, custody.sheet),
    )
    addToast(outcome.message, outcome.succeeded ? 'success' : 'error')
  }

  const goToSignReturn = (entry: CustodyReturnSummary): void => {
    void navigate(SignNavigationHelper.returnSignPath(entry.custodyId, entry.id))
  }

  const handleDownloadReturnSheet = async (entry: CustodyReturnSummary): Promise<void> => {
    const outcome = await download(SheetPathHelper.returnTarget(entry.id, entry.code, entry.sheet))
    addToast(outcome.message, outcome.succeeded ? 'success' : 'error')
  }

  const isSigned = custody.signedAt !== null
  const canSign = !isSigned && custody.status !== 'CANCELADO'

  const canReturn = CustodyPresenter.canRegisterReturn(custody)
  const returnTip = custody.pendingItemsCount === 0 ? NO_PENDING_ITEMS_TIP : CLOSED_CUSTODY_TIP

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <button
        type="button"
        onClick={goToCustodies}
        className="reveal-d1 mb-3 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-ink"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} /> Volver a Resguardos
      </button>

      <PageHero
        eyebrow="Operación · Resguardo"
        title={hero.title}
        italic={hero.italic}
        lede={hero.lede}
        actions={
          <>
            <Button
              icon={PackageDeliveredIcon}
              size="md"
              disabled={!canReturn}
              tip={canReturn ? undefined : returnTip}
              onClick={goToReturn}
            >
              Registrar devolución
            </Button>
            {canSign && (
              <Button variant="primary" icon={SignatureIcon} size="md" onClick={goToSign}>
                Firmar resguardo
              </Button>
            )}
            <Button
              icon={Download01Icon}
              size="md"
              disabled={downloading}
              tip={isSigned ? undefined : DRAFT_SHEET_TIP}
              onClick={() => void handleDownloadSheet()}
            >
              {downloading ? 'Descargando…' : 'Descargar hoja'}
            </Button>
            {canCancel && (
              <Button variant="danger" icon={Cancel01Icon} size="md" onClick={openCancelDialog}>
                Cancelar resguardo
              </Button>
            )}
          </>
        }
      />

      <div className="reveal-d2 mt-4 grid grid-cols-[300px_1fr] gap-4 max-[1100px]:grid-cols-1">
        <div className="flex flex-col gap-3">
          <CustodyEmployeeCard employee={custody.employee} />
          <CustodySummaryCard custody={custody} />
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <CustodyItemsTable items={custody.items} />
          <CustodyReturnsPanel
            custodyId={custody.id}
            returns={custody.returns}
            downloading={downloading}
            onSignReturn={goToSignReturn}
            onDownloadReturnSheet={(entry) => void handleDownloadReturnSheet(entry)}
          />
        </div>
      </div>

      <CustodyCancelDialog
        open={state.cancelDialogOpen}
        code={custody.code}
        loading={state.cancelling}
        error={state.cancelError}
        onConfirm={() => void handleConfirmCancel()}
        onClose={closeCancelDialog}
      />

      {ToastHost}
    </div>
  )
}
