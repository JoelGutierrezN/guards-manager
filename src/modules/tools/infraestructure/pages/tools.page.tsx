import { type JSX, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDown01Icon, Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { PageHero, Tabs, Button, useToasts } from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui'
import { useTools } from '../../hooks/use-tools.hook'
import { useToolsOverview } from '../../hooks/use-tools-overview.hook'
import { useToolsEntryParams } from '../../hooks/use-tools-entry-params.hook'
import { ToolFiltersPanel } from '../components/tool-filters.component'
import { ToolTable } from '../components/tool-table.component'
import { NewToolModal } from '../components/new-tool-modal.component'
import { ToolStockModal } from '../components/tool-stock-modal.component'
import { ToolDeleteModal } from '../components/tool-delete-modal.component'
import type { Tool } from '../../domain/tool.entity'
import type { ToolInput } from '../../domain/tool-input.model'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import { DEFAULT_STOCK_RANGE } from '../../application/tools-state.model'
import { ToolsEntryParamsHelper } from '../helpers/tools-entry-params.helper'
import '../../tools.css'

export function ToolsPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()
  const { stats, catalog, status: overviewStatus, reload } = useToolsOverview()

  const {
    state,
    editingTool,
    reloadList,
    toggleBrand,
    toggleModel,
    setStockRange,
    clearFilters,
    setSearch,
    toggleSort,
    setTab,
    setPage,
    toggleFiltersPanel,
    openCreateTool,
    openEditTool,
    closeToolForm,
    saveTool,
    openStock,
    closeStock,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useTools({ onMutated: reload })

  const { returnTo } = useToolsEntryParams({ onOpenCreate: openCreateTool })

  const tabItems = useMemo<TabItem<ToolsTabKey>[]>(
    () => [
      { value: 'all', label: 'Todas', count: stats?.total },
      { value: 'available', label: 'Disponibles', count: stats?.available },
      { value: 'assigned', label: 'Asignadas', count: stats?.assigned },
      { value: 'low', label: 'Stock bajo / agotadas', count: stats?.criticalStock },
    ],
    [stats],
  )

  const ledeText = useMemo(() => {
    const totalFormatted = stats ? stats.total.toLocaleString('es-MX') : '—'
    return `${totalFormatted} herramientas en inventario. Filtra por marca, modelo o estado y gestiona existencias, ingresos y asignaciones.`
  }, [stats])

  const activeFilterCount = useMemo(() => {
    const [minStock, maxStock] = state.filters.stockRange
    const isRangeActive = minStock > DEFAULT_STOCK_RANGE[0] || maxStock < DEFAULT_STOCK_RANGE[1]
    return state.filters.brands.length + state.filters.models.length + (isRangeActive ? 1 : 0)
  }, [state.filters])

  const formKey = useMemo(
    () => (state.isFormOpen ? (editingTool?.id ?? 'new') : 'closed'),
    [state.isFormOpen, editingTool],
  )

  const notifyError = useCallback((message: string) => addToast(message, 'error'), [addToast])

  const handleSubmit = useCallback(
    async (input: ToolInput) => {
      const isEditing = editingTool !== null
      const savedTool = await saveTool(input)
      addToast(
        isEditing
          ? `Herramienta "${input.name}" actualizada`
          : `Herramienta "${input.name}" creada en el catálogo`,
      )
      if (!isEditing && returnTo !== null) {
        void navigate(ToolsEntryParamsHelper.withProductId(returnTo, savedTool.id))
      }
    },
    [editingTool, saveTool, addToast, returnTo, navigate],
  )

  const handleConfirmDelete = useCallback(async () => {
    const result = await confirmDelete()
    if (result !== null && result.tone === 'success') addToast(result.message, result.tone)
  }, [confirmDelete, addToast])

  const handleCloseStock = useCallback(() => {
    closeStock()
    reloadList()
    void reload()
  }, [closeStock, reloadList, reload])

  const handleIngreso = useCallback(
    (tool: Tool) => {
      void navigate(`/stockIn?productId=${encodeURIComponent(tool.id)}`)
    },
    [navigate],
  )

  return (
    <>
      <div className="reveal-d1">
        <PageHero
          eyebrow="Catálogos · herramientas"
          title="Catálogo de herramientas"
          italic="de herramientas"
          lede={ledeText}
        />
      </div>

      <div className="reveal-d2 mb-3 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={state.tab} onChange={setTab} items={tabItems} />
        <div className="flex flex-wrap gap-2">
          <Button icon={ArrowDown01Icon} size="md" onClick={() => void navigate('/stockIn')}>
            Ingresar inventario
          </Button>
          <Button icon={Download01Icon} size="md">
            Exportar
          </Button>
          <Button variant="primary" icon={PlusSignIcon} size="md" onClick={openCreateTool}>
            Nueva herramienta
          </Button>
        </div>
      </div>

      <div className="reveal-d3 flex items-stretch gap-4 max-[1000px]:flex-col">
        {state.showFilters && (
          <div className="flex w-61 shrink-0 max-[1000px]:w-full">
            <ToolFiltersPanel
              brands={catalog?.brands ?? []}
              maxStock={catalog?.maxStock ?? 0}
              status={overviewStatus}
              filters={state.filters}
              onToggleBrand={toggleBrand}
              onToggleModel={toggleModel}
              onSetStockRange={setStockRange}
              onClearFilters={clearFilters}
              onReload={reload}
            />
          </div>
        )}

        <ToolTable
          rows={state.rows}
          status={state.status}
          error={state.error}
          total={state.total}
          lastPage={state.lastPage}
          perPage={state.perPage}
          showFilters={state.showFilters}
          activeFilterCount={activeFilterCount}
          search={state.search}
          sort={state.sort}
          page={state.page}
          onToggleFilters={toggleFiltersPanel}
          onClearFilters={clearFilters}
          onSearchChange={setSearch}
          onToggleSort={toggleSort}
          onSetPage={setPage}
          onReload={reloadList}
          onCreate={openCreateTool}
          onStock={openStock}
          onIngreso={handleIngreso}
          onEdit={openEditTool}
          onDelete={openDelete}
        />
      </div>

      <NewToolModal
        key={formKey}
        open={state.isFormOpen}
        tool={editingTool}
        onClose={closeToolForm}
        onSubmit={handleSubmit}
        onNotifyError={notifyError}
      />

      <ToolStockModal open={!!state.stockTool} tool={state.stockTool} onClose={handleCloseStock} />

      <ToolDeleteModal
        open={state.deleteTool !== null}
        tool={state.deleteTool}
        conflict={state.deleteConflict}
        loading={state.isDeleting}
        onClose={closeDelete}
        onConfirm={() => void handleConfirmDelete()}
      />

      {toastHost}
    </>
  )
}
