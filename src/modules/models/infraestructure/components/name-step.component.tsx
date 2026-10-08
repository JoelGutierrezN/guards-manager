import { type JSX } from 'react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { Brand } from '../../../brands/domain/brand.entity'
import { BrandAvatar } from '../../../brands/infraestructure/components/brand-avatar.component'
import type { NameCheckMatch } from '../../domain/product-model-name-check.model'
import type { NameCheckStatus } from '../../application/new-model-form.model'
import { NameCheckFeedback } from './name-check-feedback.component'

interface Props {
  brandName: string
  brandDetail: Brand | null
  brandDetailLoading: boolean
  name: string
  checkStatus: NameCheckStatus
  duplicateModel: NameCheckMatch | null
  similarModels: NameCheckMatch[]
  similarConfirmed: boolean
  formError: string | null
  onBack: () => void
  onNameChange: (name: string) => void
  onSimilarConfirmedChange: (confirmed: boolean) => void
}

export function NameStep({
  brandName,
  brandDetail,
  brandDetailLoading,
  name,
  checkStatus,
  duplicateModel,
  similarModels,
  similarConfirmed,
  formError,
  onBack,
  onNameChange,
  onSimilarConfirmedChange,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[14px] border border-hairline bg-cream/40 px-3.5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandAvatar name={brandName} size="md" />
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                Marca
              </div>
              <div className="truncate text-[16px] font-semibold text-ink">{brandName}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 text-[12px] font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-ink"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} />
            Cambiar
          </button>
        </div>
        <div className="mt-1.5 text-[12px] text-muted">
          {brandDetailLoading && 'Cargando información de la marca…'}
          {!brandDetailLoading && brandDetail != null && (
            <>
              {brandDetail.modelsCount} modelos · {brandDetail.toolsTotal} herramientas ·{' '}
              {brandDetail.toolsAssigned} asignadas
            </>
          )}
          {!brandDetailLoading && brandDetail == null && 'Sin información adicional de la marca.'}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-center justify-between text-[12px] font-medium text-ink-2">
          <span>
            Código de modelo <span className="text-danger">*</span>
          </span>
          <span className="text-[11px] text-muted-soft">Ej. DCD996, M18 FUEL</span>
        </label>
        <div className="flex h-[42px] items-center rounded-full border border-hairline-strong bg-white px-4 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
          <input
            className="h-full min-w-0 flex-1 border-none bg-transparent font-mono text-[14px] text-ink outline-none placeholder:text-muted-soft"
            placeholder="DCD996"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>
        <NameCheckFeedback
          status={checkStatus}
          name={name.trim()}
          duplicateModel={duplicateModel}
          similarModels={similarModels}
          similarConfirmed={similarConfirmed}
          onSimilarConfirmedChange={onSimilarConfirmedChange}
        />
        {formError != null && <span className="text-[12px] text-danger">{formError}</span>}
      </div>
    </div>
  )
}
