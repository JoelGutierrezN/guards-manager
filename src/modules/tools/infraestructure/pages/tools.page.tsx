import { type JSX, useMemo } from 'react'
import { ArrowDown01Icon, Download01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { PageHero, Tabs, Button, useToasts } from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui/tabs.model'
import { useToolsInventory } from '../../hooks/use-tools-inventory.hook'
import { ToolFiltersPanel } from '../components/tool-filters.component'
import { ToolTable } from '../components/tool-table.component'
import { NewToolModal } from '../components/new-tool-modal.component'
import { ToolIngresoModal } from '../components/tool-ingreso-modal.component'
import { ToolProgressOverlay } from '../components/tool-progress-overlay.component'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'
import '../../tools.css'

const TAB_ITEMS: TabItem<ToolsTabKey>[] = [
  { value: 'all', label: 'Todas', count: MOCK_TOOLS_STATS.tabCounts.all },
  { value: 'available', label: 'Disponibles', count: MOCK_TOOLS_STATS.tabCounts.available },
  { value: 'assigned', label: 'Asignadas', count: MOCK_TOOLS_STATS.tabCounts.assigned },
  { value: 'low', label: 'Stock bajo / agotadas', count: MOCK_TOOLS_STATS.tabCounts.low },
]

export function ToolsPage(): JSX.Element {
  const [addToast, toastHost] = useToasts()

  const {
    state,
    filteredRows,
    toggleBrand,
    toggleModel,
    setStockRange,
    setSearch,
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
    progress,
  } = useToolsInventory()

  const gridStyle = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: state.showFilters ? '240px 1fr' : '1fr',
      gap: '16px',
    }),
    [state.showFilters],
  )

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
    // TODO API: sin herramienta pre-seleccionada, el ingreso requiere el selector de herramienta del modal.
  }

  const handleFinishIngreso = () => {
    if (progress) {
      const unitLabel = progress.total === 1 ? 'unidad' : 'unidades'
      const pastLabel = progress.total === 1 ? 'ingresada' : 'ingresadas'
      addToast(`${progress.total} ${unitLabel} ${pastLabel} · ${progress.tool.name}`)
    }
    finishIngreso()
  }

  return (
    <>
      <div className="reveal d1">
        <PageHero
          eyebrow="Catálogo · herramientas"
          title="Catálogo de herramientas"
          italic="de herramientas"
          lede="1,284 herramientas en el catálogo. 412 disponibles y 798 asignadas en este momento."
          actions={
            <>
              <Button icon={ArrowDown01Icon} size="md" onClick={() => openIngreso(null)}>
                Ingresar inventario
              </Button>
              {/* TODO API: GET /api/tools/export (descarga del catálogo en CSV/Excel). */}
              <Button icon={Download01Icon} size="md">
                Exportar
              </Button>
              <Button variant="primary" icon={PlusSignIcon} size="md" onClick={openNewTool}>
                Nueva herramienta
              </Button>
            </>
          }
        />
      </div>

      <div className="reveal d2 mb-3">
        <Tabs value={state.tab} onChange={setTab} items={TAB_ITEMS} />
      </div>

      <div className="reveal d3 max-[1000px]:!grid-cols-1" style={gridStyle}>
        {state.showFilters && (
          <ToolFiltersPanel
            filters={state.filters}
            onToggleBrand={toggleBrand}
            onToggleModel={toggleModel}
            onSetStockRange={setStockRange}
            onClearFilters={clearFilters}
          />
        )}

        <ToolTable
          rows={filteredRows}
          totalCount={MOCK_TOOLS_STATS.totalCount}
          showFilters={state.showFilters}
          searchQuery={state.searchQuery}
          page={state.page}
          onToggleFilters={toggleFiltersPanel}
          onSearch={setSearch}
          onClearFilters={clearFilters}
          onSetPage={setPage}
        />
      </div>

      <NewToolModal open={state.newToolOpen} onClose={closeNewTool} onSave={handleNewToolSave} />

      <ToolIngresoModal
        open={state.ingresoOpen}
        tool={state.ingresoTool}
        onClose={closeIngreso}
        onConfirm={handleConfirmIngreso}
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
