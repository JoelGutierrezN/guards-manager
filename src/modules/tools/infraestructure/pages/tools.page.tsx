import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDown01Icon, Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { PageHero, Tabs, Button, useToasts } from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui'
import { useToolsInventory } from '../../hooks/use-tools-inventory.hook'
import { ToolFiltersPanel } from '../components/tool-filters.component'
import { ToolTable } from '../components/tool-table.component'
import { NewToolModal } from '../components/new-tool-modal.component'
import { ToolIngresoModal } from '../components/tool-ingreso-modal.component'
import { ToolStockModal } from '../components/tool-stock-modal.component'
import { ToolDeleteModal } from '../components/tool-delete-modal.component'
import { ToolProgressOverlay } from '../components/tool-progress-overlay.component'
import type { Tool } from '../../domain/tool.entity'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import { DEFAULT_STOCK_RANGE } from '../../application/tools-state.model'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'
import '../../tools.css'

const TAB_ITEMS: TabItem<ToolsTabKey>[] = [
  { value: 'all', label: 'Todas', count: MOCK_TOOLS_STATS.tabCounts.all },
  { value: 'available', label: 'Disponibles', count: MOCK_TOOLS_STATS.tabCounts.available },
  { value: 'assigned', label: 'Asignadas', count: MOCK_TOOLS_STATS.tabCounts.assigned },
  { value: 'low', label: 'Stock bajo / agotadas', count: MOCK_TOOLS_STATS.tabCounts.low },
]

export function ToolsPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()

  const {
    state,
    filteredRows,
    toggleBrand,
    toggleModel,
    setStockRange,
    clearFilters,
    setTab,
    setPage,
    toggleFiltersPanel,
    openNewTool,
    closeNewTool,
    openIngreso,
    closeIngreso,
    confirmIngreso,
    finishIngreso,
    openStock,
    closeStock,
    openDelete,
    closeDelete,
    confirmDelete,
    progress,
  } = useToolsInventory()

  const [minStock, maxStock] = state.filters.stockRange
  const rangeActive = minStock > DEFAULT_STOCK_RANGE[0] || maxStock < DEFAULT_STOCK_RANGE[1]
  const activeFilterCount =
    state.filters.brands.length + state.filters.models.length + (rangeActive ? 1 : 0)

  const handleNewToolSave = (tool: { name: string; brand: string; model: string }) => {
    // TODO API: POST /api/tools (crear herramienta en el catálogo) y refrescar listado/stats.
    addToast(`Herramienta "${tool.name}" creada en el catálogo`)
    closeNewTool()
  }

  const handleConfirmIngreso = (quantity: number) => {
    if (state.ingresoTool) {
      // TODO API: POST /api/tools/{id}/stock-in (registrar ingreso) antes de actualizar el inventario.
      confirmIngreso(state.ingresoTool, quantity)
    }
  }

  const handleFinishIngreso = () => {
    if (progress) {
      const unitLabel = progress.total === 1 ? 'unidad' : 'unidades'
      const pastLabel = progress.total === 1 ? 'ingresada' : 'ingresadas'
      addToast(`${progress.total} ${unitLabel} ${pastLabel} · ${progress.tool.name}`)
    }
    finishIngreso()
  }

  const handleConfirmDelete = (tool: Tool) => {
    // TODO API: DELETE /api/tools/{id} (eliminar del catálogo) antes de actualizar el listado.
    confirmDelete(tool)
    addToast(`Herramienta "${tool.name}" eliminada del catálogo`)
  }

  return (
    <>
      <div className="reveal d1">
        <PageHero
          compact
          dense
          eyebrow="Catálogos · herramientas"
          title="Catálogo de herramientas"
          italic="de herramientas"
          lede="1,284 herramientas en inventario. Filtra por marca, modelo o estado y gestiona existencias, ingresos y asignaciones."
        />
      </div>

      <div className="reveal d2 mb-3 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={state.tab} onChange={setTab} items={TAB_ITEMS} />
        <div className="flex flex-wrap gap-2">
          <Button icon={ArrowDown01Icon} size="md" onClick={() => navigate('/stockIn')}>
            Ingresar inventario
          </Button>
          {/* TODO API: GET /api/tools/export (descarga del catálogo en CSV/Excel). */}
          <Button icon={Download01Icon} size="md">
            Exportar
          </Button>
          <Button variant="primary" icon={PlusSignIcon} size="md" onClick={openNewTool}>
            Nueva herramienta
          </Button>
        </div>
      </div>

      <div className="reveal d3 flex items-stretch gap-4 max-[1000px]:flex-col">
        {state.showFilters && (
          <div className="flex w-[244px] shrink-0 max-[1000px]:w-full">
            <ToolFiltersPanel
              filters={state.filters}
              onToggleBrand={toggleBrand}
              onToggleModel={toggleModel}
              onSetStockRange={setStockRange}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        <ToolTable
          rows={filteredRows}
          totalCount={MOCK_TOOLS_STATS.totalCount}
          showFilters={state.showFilters}
          activeFilterCount={activeFilterCount}
          page={state.page}
          onToggleFilters={toggleFiltersPanel}
          onClearFilters={clearFilters}
          onSetPage={setPage}
          onStock={openStock}
          onIngreso={openIngreso}
          onEdit={openNewTool}
          onDelete={openDelete}
        />
      </div>

      <NewToolModal open={state.newToolOpen} onClose={closeNewTool} onSave={handleNewToolSave} />

      <ToolIngresoModal
        open={!!state.ingresoTool}
        tool={state.ingresoTool}
        onClose={closeIngreso}
        onConfirm={handleConfirmIngreso}
      />

      <ToolStockModal open={!!state.stockTool} tool={state.stockTool} onClose={closeStock} />

      <ToolDeleteModal
        open={!!state.deleteTool}
        tool={state.deleteTool}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
      />

      {progress && (
        <ToolProgressOverlay
          total={progress.total}
          tool={progress.tool}
          onDone={handleFinishIngreso}
        />
      )}

      {toastHost}
    </>
  )
}
