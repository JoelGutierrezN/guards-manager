import { type JSX, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowDown01Icon,
  Download01Icon,
  PlusSignIcon,
  PackageIcon,
  Tick01Icon,
  SentIcon,
  RefreshIcon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import {
  PageHero,
  StatStrip,
  Tabs,
  Button,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui/tabs.model'
import type { StatStripEntry } from '../../../shared/infraestructure/components/ui/stat-strip.model'
import { useToolsInventory } from '../../hooks/use-tools-inventory.hook'
import { ToolFiltersPanel } from '../components/tool-filters.component'
import { ToolTable } from '../components/tool-table.component'
import { NewToolModal } from '../components/new-tool-modal.component'
import { ToolIngresoModal } from '../components/tool-ingreso-modal.component'
import { ToolProgressOverlay } from '../components/tool-progress-overlay.component'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import { MOCK_TOOLS_STATS } from '../mocks/tools-stats.mock'
import '../../tools.css'

// TODO API: los valores y deltas provienen de GET /api/tools/stats (ver MOCK_TOOLS_STATS).
const STAT_STRIP_ITEMS: StatStripEntry[] = [
  { icon: PackageIcon, label: 'Total inventario', value: MOCK_TOOLS_STATS.kpis.total, delta: MOCK_TOOLS_STATS.kpis.totalDelta },
  { icon: Tick01Icon, label: 'Disponibles', value: MOCK_TOOLS_STATS.kpis.available, delta: MOCK_TOOLS_STATS.kpis.availableDelta, tone: 'lavender' },
  { icon: SentIcon, label: 'Asignadas', value: MOCK_TOOLS_STATS.kpis.assigned, delta: MOCK_TOOLS_STATS.kpis.assignedDelta, tone: 'accent' },
  { icon: RefreshIcon, label: 'Mantenimiento', value: MOCK_TOOLS_STATS.kpis.maintenance, delta: MOCK_TOOLS_STATS.kpis.maintenanceDelta, deltaTone: 'up' },
  { icon: Alert02Icon, label: 'Stock crítico', value: MOCK_TOOLS_STATS.kpis.critical, delta: MOCK_TOOLS_STATS.kpis.criticalDelta, deltaTone: 'down' },
]

const TAB_ITEMS: TabItem<ToolsTabKey>[] = [
  { value: 'all', label: 'Todas', count: MOCK_TOOLS_STATS.tabCounts.all },
  { value: 'available', label: 'Disponibles', count: MOCK_TOOLS_STATS.tabCounts.available },
  { value: 'low', label: 'Stock bajo / agotadas', count: MOCK_TOOLS_STATS.tabCounts.low },
  { value: 'mantto', label: 'Mantenimiento', count: MOCK_TOOLS_STATS.tabCounts.mantto },
  { value: 'baja', label: 'Bajas', count: MOCK_TOOLS_STATS.tabCounts.baja },
]

export function ToolsPage(): JSX.Element {
  const navigate = useNavigate()
  const [addToast, toastHost] = useToasts()

  const {
    state,
    filteredRows,
    allSelected,
    someSelected,
    toggleBrand,
    toggleStatus,
    clearFilters,
    toggleSelect,
    toggleSelectAll,
    setTab,
    setPage,
    toggleFiltersPanel,
    setDensity,
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
          title="Herramientas activas"
          italic="activas"
          lede="1,284 herramientas en circulación. 412 disponibles, 798 asignadas y 52 en servicio técnico esta semana."
          actions={
            <>
              <Button
                icon={ArrowDown01Icon}
                size="md"
                onClick={() => navigate('/dashboard/stockIn')}
              >
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

      <div className="reveal d2">
        <StatStrip items={STAT_STRIP_ITEMS} />
      </div>

      <div className="reveal d3 mb-3">
        <Tabs value={state.tab} onChange={setTab} items={TAB_ITEMS} />
      </div>

      <div className="reveal d4 max-[1000px]:!grid-cols-1" style={gridStyle}>
        {state.showFilters && (
          <ToolFiltersPanel
            filters={state.filters}
            onToggleBrand={toggleBrand}
            onToggleStatus={toggleStatus}
            onClearFilters={clearFilters}
          />
        )}

        <ToolTable
          rows={filteredRows}
          totalCount={MOCK_TOOLS_STATS.totalCount}
          selectedIds={state.selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          showFilters={state.showFilters}
          density={state.density}
          page={state.page}
          onToggleFilters={toggleFiltersPanel}
          onSetDensity={setDensity}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelect={toggleSelect}
          onOpenIngreso={openIngreso}
          onClearFilters={clearFilters}
          onSetPage={setPage}
        />
      </div>

      <NewToolModal
        open={state.newToolOpen}
        onClose={closeNewTool}
        onSave={handleNewToolSave}
      />

      <ToolIngresoModal
        open={!!state.ingresoTool}
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
