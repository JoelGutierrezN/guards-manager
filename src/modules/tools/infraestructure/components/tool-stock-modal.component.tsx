import { type JSX, useEffect, useMemo } from 'react'
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import {
  Modal,
  IconButton,
  Tabs,
  SearchInput,
  Pager,
  Empty,
  Skeleton,
  ConfirmDialog,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import type { StockUnitStatus } from '../../domain/tool-unit.model'
import { useStockUnits } from '../../hooks/use-stock-units.hook'
import { ToolStockUnitRow } from './tool-stock-unit-row.component'
import { ToolStockAssignedRow } from './tool-stock-assigned-row.component'

interface Props {
  open: boolean
  tool: Tool | null
  onClose: () => void
}

const TAB_LABELS: Record<StockUnitStatus, string> = {
  available: 'Disponibles',
  assigned: 'Asignadas',
  unusable: 'Inutilizables',
}

export function ToolStockModal({ open, tool, onClose }: Props): JSX.Element {
  const [addToast, toastHost] = useToasts()
  const {
    state,
    activeTabState,
    setTab,
    setQuery,
    setPage,
    changeCondition,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useStockUnits(tool?.id ?? null, open)

  useEffect(() => {
    if (state.actionError) addToast(state.actionError, 'error')
  }, [state.actionError, addToast])

  const tabItems = useMemo<TabItem<StockUnitStatus>[]>(
    () =>
      (Object.keys(TAB_LABELS) as StockUnitStatus[]).map((status) => ({
        value: status,
        label: TAB_LABELS[status],
        count: state.tabs[status].total,
      })),
    [state.tabs],
  )

  const handleClose = () => {
    setQuery('')
    onClose()
  }

  const handleConfirmDelete = async () => {
    const succeeded = await confirmDelete()
    if (succeeded) addToast('Unidad eliminada')
  }

  const showSkeletons = activeTabState.status === 'loading'
  const skeletonSlots = useMemo(
    () => [...Array(activeTabState.perPage).keys()],
    [activeTabState.perPage],
  )
  const isAssignedTab = state.activeTab === 'assigned'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth={860}
      className="flex h-[min(720px,88vh)] max-h-[88vh] flex-col overflow-hidden"
    >
      <div className="flex shrink-0 items-start justify-between border-b border-hairline px-6 pb-4 pt-5">
        <div className="min-w-0">
          <div className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
            Existencias en detalle
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {tool?.name ?? ''}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {tool ? `${tool.brand} · ${tool.model}` : ''}
            </span>
          </div>
        </div>
        <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-b border-hairline px-6 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={state.activeTab} items={tabItems} onChange={setTab} />
          <SearchInput
            value={state.query}
            onChange={setQuery}
            placeholder="Buscar por consecutivo…"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6 pt-4">
        {activeTabState.status === 'error' && (
          <div className="px-0.5 py-4 text-center text-[13px] text-danger">
            {activeTabState.error}
          </div>
        )}

        {showSkeletons && (
          <div className="flex flex-col gap-2">
            {skeletonSlots.map((slot) => (
              <Skeleton key={slot} shape="block" height="34px" />
            ))}
          </div>
        )}

        {!showSkeletons &&
          activeTabState.status !== 'error' &&
          activeTabState.units.length === 0 && <Empty title="Sin unidades en esta categoría." />}

        {!showSkeletons && activeTabState.units.length > 0 && (
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  N.º de unidad
                </th>
                <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Condición
                </th>
                {isAssignedTab ? (
                  <>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Asignada a
                    </th>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Folio
                    </th>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Desde
                    </th>
                  </>
                ) : (
                  <>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Ingresó
                    </th>
                    <th className="border-b border-hairline" />
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isAssignedTab
                ? activeTabState.units.map((unit) => (
                    <ToolStockAssignedRow key={unit.id} unit={unit} />
                  ))
                : activeTabState.units.map((unit) => (
                    <ToolStockUnitRow
                      key={unit.id}
                      unit={unit}
                      pending={state.pendingUnitId === unit.id}
                      onConditionChange={changeCondition}
                      onDelete={openDelete}
                    />
                  ))}
            </tbody>
          </table>
        )}

        <Pager
          page={activeTabState.page}
          lastPage={activeTabState.lastPage}
          total={activeTabState.total}
          onChange={setPage}
          itemsLabel="unidades"
        />
      </div>

      <ConfirmDialog
        open={!!state.deletingUnit}
        title="¿Eliminar unidad?"
        eyebrow="Eliminar unidad"
        icon={Delete02Icon}
        destructive
        loading={!!state.pendingUnitId}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onClose={closeDelete}
        body={
          state.deletingUnit && (
            <p>
              Vas a eliminar la unidad <b className="text-ink">{state.deletingUnit.consecutive}</b>.
              Esta acción no se puede deshacer.
            </p>
          )
        }
      />

      {toastHost}
    </Modal>
  )
}
