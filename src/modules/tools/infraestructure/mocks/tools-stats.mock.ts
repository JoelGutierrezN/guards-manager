// TODO API: reemplazar por GET /api/tools/stats (KPIs, conteos por estado/marca/pestaña,
//           totales de paginación y rango de stock). Al integrar la API, eliminar este mock.
import type { ToolsStats } from '../../domain/tools-stats.model'

export const MOCK_TOOLS_STATS: ToolsStats = {
  kpis: {
    total: '1,284',
    totalDelta: '+12 mes',
    available: '412',
    availableDelta: '32%',
    assigned: '798',
    assignedDelta: '62%',
    maintenance: '52',
    maintenanceDelta: '+4 sem',
    critical: '22',
    criticalDelta: 'atención',
  },
  tabCounts: { all: 1284, available: 412, low: 22, mantto: 52, baja: 22 },
  statusCounts: { ok: 412, warn: 8, low: 14, mantto: 52, baja: 22 },
  brandCounts: { DeWalt: 86, Makita: 32, Milwaukee: 18, Bosch: 41, Fluke: 10 },
  totalCount: 142,
  pageCount: 24,
  stockRange: { min: 0, max: 50 },
}
