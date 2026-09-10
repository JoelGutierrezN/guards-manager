import { type JSX, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import type { ApiConflictDetail } from '../../../shared/infraestructure/errors/api-conflict.model'
import { SignPresenter } from '../../application/sign-presenter.helper'
import { useSignature } from '../../hooks/use-signature.hook'
import { SignDocumentCard } from '../components/sign/sign-document-card.component'
import { SignForm } from '../components/sign/sign-form.component'
import { SignLoadError } from '../components/sign/sign-load-error.component'
import { SignSkeleton } from '../components/sign/sign-skeleton.component'
import { SignSuccess } from '../components/sign/sign-success.component'
import { SignNavigationHelper } from '../helpers/sign-navigation.helper'

const SIGNED_TITLE = 'Hoja firmada'
const HERO_EYEBROW = 'Operación · firma'
const CANCELLED_MESSAGE = 'Este resguardo está cancelado: su hoja ya no se puede firmar.'

export function SignSheetPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()
  const {
    state,
    hero,
    canSubmit,
    isNotFound,
    alreadySigned,
    downloading,
    reload,
    setSignerName,
    setSignatureImage,
    submit,
    downloadSheet,
  } = useSignature()

  const { signDocument, status, result, error } = state

  const goToCustodies = useCallback(() => {
    void navigate(SignNavigationHelper.custodiesPath())
  }, [navigate])

  const goToCustody = useCallback(() => {
    if (signDocument === null) return
    void navigate(SignNavigationHelper.custodyPath(signDocument.custodyId))
  }, [navigate, signDocument])

  const goToEmployeeFile = useCallback(() => {
    if (signDocument === null || signDocument.employeeId === null) return
    void navigate(SignNavigationHelper.employeeDocumentsPath(signDocument.employeeId))
  }, [navigate, signDocument])

  const handleSubmit = useCallback(async (): Promise<void> => {
    const signature = await submit()
    if (signature === null || signDocument === null) return
    addToast(`Hoja ${signDocument.code} firmada.`)
  }, [submit, addToast, signDocument])

  const handleDownload = useCallback(async (): Promise<void> => {
    const outcome = await downloadSheet()
    if (outcome === null) return
    addToast(outcome.message, outcome.succeeded ? 'success' : 'error')
  }, [downloadSheet, addToast])

  const notice = useMemo<ApiConflictDetail | null>(() => {
    if (error === null) return null
    return { message: error.message, reasons: error.reasons }
  }, [error])

  if (status === 'loading') return <SignSkeleton />

  if (status === 'error' || signDocument === null) {
    return (
      <SignLoadError
        message={state.loadError}
        notFound={isNotFound}
        onRetry={reload}
        onBack={goToCustodies}
      />
    )
  }

  if (signDocument.isCancelled) {
    return (
      <SignLoadError
        message={CANCELLED_MESSAGE}
        notFound={false}
        onRetry={reload}
        onBack={goToCustodies}
      />
    )
  }

  const isSigned = status === 'done' || alreadySigned
  const signedMessage =
    result !== null
      ? `Firmó ${result.signature.signerName}. La hoja PDF ya está disponible.`
      : SignPresenter.signedNotice(signDocument)
  const signedDetail =
    result?.sheet == null ? null : `Archivo ${SignPresenter.sizeLabel(result.sheet.sizeBytes)}`

  return (
    <div className="mx-auto w-full max-w-300">
      <PageHero eyebrow={HERO_EYEBROW} title={hero.title} italic={hero.italic} lede={hero.lede} />

      <div className="reveal-d2 mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        {isSigned ? (
          <SignSuccess
            title={SIGNED_TITLE}
            code={signDocument.code}
            message={signedMessage}
            detail={signedDetail}
            downloading={downloading}
            canOpenEmployeeFile={signDocument.employeeId !== null}
            onDownload={() => void handleDownload()}
            onViewEmployeeFile={goToEmployeeFile}
            onViewCustody={goToCustody}
          />
        ) : (
          <SignForm
            signerName={state.signerName}
            signerNameError={error?.fieldErrors.signerName}
            signatureError={error?.fieldErrors.image}
            notice={notice}
            submitting={status === 'submitting'}
            canSubmit={canSubmit}
            onSignerNameChange={setSignerName}
            onSignatureChange={setSignatureImage}
            onSubmit={() => void handleSubmit()}
            onCancel={goToCustody}
          />
        )}

        <SignDocumentCard signDocument={signDocument} />
      </div>

      {toastHost}
    </div>
  )
}
