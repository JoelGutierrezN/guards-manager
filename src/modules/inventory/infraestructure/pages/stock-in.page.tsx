import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { PackageAddIcon } from '@hugeicons/core-free-icons'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import { useStockIn } from '../../hooks/use-stock-in.hook'
import { StockInErrorNotice } from '../components/stock-in-error-notice.component'
import { StockInProductBlock } from '../components/stock-in-product-block.component'
import { StockInQuantityBlock } from '../components/stock-in-quantity-block.component'
import { StockInSection } from '../components/stock-in-section.component'
import { StockInSummary } from '../components/stock-in-summary.component'
import { StockInNavigationHelper } from '../helpers/stock-in-navigation.helper'

export function StockInPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()
  const {
    state,
    canSubmit,
    loadProductOptions,
    selectProduct,
    setQuantity,
    setCondition,
    retryProduct,
    startAnotherEntry,
    submit,
  } = useStockIn()

  const isSubmitting = state.status === 'submitting'
  const isDone = state.status === 'done'
  const hasProductLoadError = state.product === null && state.error !== null

  const handleSubmit = async (): Promise<void> => {
    const result = await submit()
    if (result === null) return
    addToast(
      `Se registraron ${result.createdCount} unidades (${result.range.from} — ${result.range.to}).`,
    )
  }

  const handleCreateProduct = () => {
    void navigate(StockInNavigationHelper.newProductPath())
  }

  const handleGoToTools = () => {
    if (state.result === null) return
    void navigate(StockInNavigationHelper.toolsPathFor(state.result.product.name))
  }

  return (
    <div className="mx-auto w-full max-w-250">
      <PageHero
        eyebrow="Inventario · ingreso"
        title="Ingreso de inventario"
        italic="de inventario"
        lede="Da de alta unidades de una herramienta existente. Cada unidad recibe su folio consecutivo."
      />

      <div className="reveal-d2 mt-5 flex flex-col gap-4">
        <StockInSection step={1} title="Producto" hint="Elige la herramienta que vas a ingresar.">
          <StockInProductBlock
            product={state.product}
            isLoading={state.isProductLoading}
            errorMessage={state.error?.fieldErrors.product}
            disabled={isSubmitting || isDone}
            loadOptions={loadProductOptions}
            onSelect={selectProduct}
            onCreateProduct={handleCreateProduct}
          />
        </StockInSection>

        <StockInSection
          step={2}
          title="Cantidad y condición"
          hint="Hasta 500 unidades por ingreso."
        >
          <StockInQuantityBlock
            quantity={state.quantity}
            condition={state.condition}
            quantityError={state.error?.fieldErrors.quantity}
            conditionError={state.error?.fieldErrors.condition}
            disabled={isSubmitting || isDone}
            onQuantityChange={setQuantity}
            onConditionChange={setCondition}
          />
        </StockInSection>

        {isDone && state.result !== null ? (
          <StockInSummary
            result={state.result}
            onAnotherEntry={startAnotherEntry}
            onGoToTools={handleGoToTools}
          />
        ) : (
          <StockInSection step={3} title="Confirmar" hint="Revisa los datos antes de registrar.">
            <div className="flex flex-col gap-3">
              {state.error && (
                <StockInErrorNotice
                  error={state.error}
                  onRetry={hasProductLoadError ? retryProduct : undefined}
                />
              )}
              <div>
                <Button
                  variant="primary"
                  size="lg"
                  icon={PackageAddIcon}
                  disabled={!canSubmit}
                  onClick={() => void handleSubmit()}
                >
                  {isSubmitting ? 'Registrando…' : 'Registrar ingreso'}
                </Button>
              </div>
              {state.product === null && !state.isProductLoading && (
                <p className="m-0 text-[12px] text-muted">
                  Elige un producto para habilitar el registro.
                </p>
              )}
            </div>
          </StockInSection>
        )}
      </div>

      {toastHost}
    </div>
  )
}
