import { type JSX, useCallback } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  Button,
  FormField,
  IconButton,
  Input,
  Modal,
  Pager,
  Textarea,
} from '../../../shared/infraestructure/components/ui'
import type { ToolUnit } from '../../domain/tool-unit.model'
import { useSerialCorrection } from '../../hooks/use-serial-correction.hook'
import { SerialCorrectionHistoryRow } from './serial-correction-history-row.component'

interface Props {
  unit: ToolUnit
  onClose: () => void
  onSaved: (unit: ToolUnit) => void
}

export function SerialCorrectionModal({ unit, onClose, onSaved }: Props): JSX.Element {
  const { state, setField, setConfirming, canReview, save, download, loadHistory } =
    useSerialCorrection(unit, onSaved)
  const handleLatestDownload = useCallback(() => {
    if (state.latest !== null) void download(state.latest)
  }, [state.latest, download])
  const handleClose = useCallback(() => {
    if (!state.saving) onClose()
  }, [state.saving, onClose])

  return (
    <Modal open onClose={handleClose} maxWidth={640} className="max-h-[88vh] overflow-y-auto">
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
              Inventario · {unit.consecutive}
            </p>
            <h2 className="mb-1 mt-1 font-display text-[30px] leading-tight text-ink">
              Corregir serie
            </h2>
            <p className="m-0 text-[12px] text-muted">
              El cambio se registra en el historial del bien.
            </p>
          </div>
          <IconButton
            icon={Cancel01Icon}
            onClick={handleClose}
            disabled={state.saving}
            aria-label="Cerrar corrección de serie"
            size="sm"
            bordered
          />
        </div>

        <div className="mb-4 rounded-[16px] bg-brand-soft p-4 text-[12px] text-ink-2">
          Serie actual
          <p className="m-0 mt-1 break-all font-mono font-semibold text-ink">
            {state.unit.serial ?? 'Sin serie registrada'}
          </p>
          {state.unit.custody !== null && (
            <p className="mb-0 mt-2">
              Asignada a {state.unit.custody.employeeName ?? state.unit.custody.employeeIdentifier}{' '}
              ({state.unit.custody.code}). Se generará un acuse independiente para imprimir y
              entregar al responsable.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <FormField
            label="Nueva serie"
            htmlFor="serial-correction-new"
            required
            error={state.errors.serial}
            helpText="Se guardará en mayúsculas y sin espacios al inicio o al final."
          >
            <Input
              id="serial-correction-new"
              value={state.serial}
              onChange={(event) => setField('serial', event.target.value)}
              maxLength={255}
              required
              disabled={state.saving}
              error={state.errors.serial !== undefined}
              aria-invalid={state.errors.serial !== undefined}
            />
          </FormField>
          <FormField
            label="Motivo de la corrección"
            htmlFor="serial-correction-reason"
            hint="Opcional"
            error={state.errors.reason}
          >
            <Textarea
              id="serial-correction-reason"
              value={state.reason}
              onChange={(event) => setField('reason', event.target.value)}
              maxLength={1000}
              disabled={state.saving}
              placeholder="Por ejemplo: se capturó un carácter incorrecto"
            />
          </FormField>

          {state.errors.message !== null && (
            <p className="m-0 text-[12px] text-danger" role="alert">
              {state.errors.message}
            </p>
          )}
          {state.notice !== null && (
            <p className="m-0 text-[12px] text-ink-2" role="status">
              {state.notice}
            </p>
          )}

          {state.confirming ? (
            <div className="rounded-[16px] border border-lavender-line bg-brand-soft p-4 text-[12px] text-ink-2">
              <p className="m-0">
                Vas a cambiar la serie de <b>{unit.consecutive}</b> de{' '}
                <b className="break-all">{state.unit.serial ?? 'sin serie'}</b> a{' '}
                <b className="break-all">{state.serial.trim().toUpperCase()}</b>. La condición y el
                resguardo se conservan.
              </p>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setConfirming(false)}
                  disabled={state.saving}
                >
                  Volver
                </Button>
                <Button variant="primary" onClick={() => void save()} disabled={state.saving}>
                  {state.saving ? 'Guardando…' : 'Confirmar corrección'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button variant="primary" disabled={!canReview} onClick={() => setConfirming(true)}>
                Revisar corrección
              </Button>
            </div>
          )}

          {state.latest?.receipt != null && (
            <Button onClick={handleLatestDownload} disabled={state.downloadingId !== null}>
              Descargar acuse
            </Button>
          )}
        </div>

        <section className="mt-6 border-t border-hairline pt-4" aria-label="Historial de series">
          <h3 className="mb-3 mt-0 text-[14px] font-semibold text-ink">Historial de series</h3>
          {state.historyLoading && <p className="text-[12px] text-muted">Cargando historial…</p>}
          {state.historyError !== null && (
            <div role="alert">
              <p className="text-[12px] text-danger">{state.historyError}</p>
              <Button size="sm" onClick={() => void loadHistory(state.history?.page ?? 1)}>
                Reintentar historial
              </Button>
            </div>
          )}
          {!state.historyLoading && state.history?.corrections.length === 0 && (
            <p className="text-[12px] text-muted">Esta unidad aún no tiene correcciones.</p>
          )}
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {state.history?.corrections.map((correction) => (
              <SerialCorrectionHistoryRow
                key={correction.id}
                correction={correction}
                downloading={state.downloadingId === correction.id}
                downloadDisabled={state.downloadingId !== null}
                onDownload={(selected) => void download(selected)}
              />
            ))}
          </ul>
          {state.history !== null && (
            <Pager
              page={state.history.page}
              lastPage={state.history.lastPage}
              total={state.history.total}
              onChange={(page) => void loadHistory(page)}
              itemsLabel="correcciones"
            />
          )}
        </section>
      </div>
    </Modal>
  )
}
