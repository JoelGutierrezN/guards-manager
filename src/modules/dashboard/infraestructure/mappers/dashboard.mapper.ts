import type { DashboardActivityType } from '../../domain/dashboard-activity-type.model'
import type { DashboardCriticalStockItem } from '../../domain/dashboard-critical-stock-item.model'
import type { DashboardKpis } from '../../domain/dashboard-kpis.model'
import type { DashboardOverview } from '../../domain/dashboard-overview.model'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'
import type { DashboardRecentActivity } from '../../domain/dashboard-recent-activity.model'
import type { DashboardSeriesPoint } from '../../domain/dashboard-series-point.model'
import type {
  DashboardCriticalStockItemDto,
  DashboardKpisDto,
  DashboardOverviewDto,
  DashboardPendingSignatureDto,
  DashboardRecentActivityDto,
  DashboardSeriesPointDto,
} from '../dto/dashboard.dto'

const RETURN_TYPE: DashboardActivityType = 'devolucion'
const ASSIGNMENT_TYPE: DashboardActivityType = 'asignacion'
const UNKNOWN_BRAND = 'Sin marca'

export class DashboardMapper {
  static toOverview(dto: DashboardOverviewDto): DashboardOverview {
    return {
      kpis: DashboardMapper.toKpis(dto.kpis),
      series: (dto.series ?? []).map((point) => DashboardMapper.toSeriesPoint(point)),
      recent: (dto.recent ?? []).map((entry) => DashboardMapper.toRecentActivity(entry)),
      pendingSignatures: (dto.pendingSignatures ?? []).map((entry) =>
        DashboardMapper.toPendingSignature(entry),
      ),
      criticalStock: (dto.criticalStock ?? []).map((entry) =>
        DashboardMapper.toCriticalStockItem(entry),
      ),
    }
  }

  private static toKpis(dto: DashboardKpisDto | undefined): DashboardKpis {
    return {
      toolsTotal: DashboardMapper.toCount(dto?.toolsTotal),
      toolsAvailable: DashboardMapper.toCount(dto?.toolsAvailable),
      toolsAssigned: DashboardMapper.toCount(dto?.toolsAssigned),
      toolsUnusable: DashboardMapper.toCount(dto?.toolsUnusable),
      employeesActive: DashboardMapper.toCount(dto?.employeesActive),
      custodiesActive: DashboardMapper.toCount(dto?.custodiesActive),
      pendingSignatures: DashboardMapper.toCount(dto?.pendingSignatures),
      alerts: DashboardMapper.toCount(dto?.alerts),
      criticalStockProducts: DashboardMapper.toCount(dto?.criticalStockProducts),
    }
  }

  private static toSeriesPoint(dto: DashboardSeriesPointDto): DashboardSeriesPoint {
    return {
      weekStart: dto.weekStart ?? '',
      assignments: DashboardMapper.toCount(dto.assignments),
      returns: DashboardMapper.toCount(dto.returns),
    }
  }

  private static toRecentActivity(dto: DashboardRecentActivityDto): DashboardRecentActivity {
    return {
      type: DashboardMapper.toActivityType(dto.type),
      code: dto.code ?? '',
      employeeName: dto.employeeName ?? '',
      employeeId: dto.employeeId ?? '',
      itemsCount: DashboardMapper.toCount(dto.itemsCount),
      date: dto.date ?? '',
      custodyId: dto.custodyId ?? '',
    }
  }

  private static toPendingSignature(dto: DashboardPendingSignatureDto): DashboardPendingSignature {
    return {
      id: dto.id ?? '',
      type: DashboardMapper.toActivityType(dto.type),
      code: dto.code ?? '',
      employeeName: dto.employeeName ?? '',
      date: dto.date ?? '',
      custodyId: dto.custodyId ?? '',
    }
  }

  private static toCriticalStockItem(
    dto: DashboardCriticalStockItemDto,
  ): DashboardCriticalStockItem {
    return {
      productId: dto.productId ?? '',
      name: dto.name ?? '',
      brandName: dto.brandName ?? UNKNOWN_BRAND,
      available: DashboardMapper.toCount(dto.available),
      threshold: DashboardMapper.toCount(dto.threshold),
    }
  }

  private static toActivityType(value: string | undefined): DashboardActivityType {
    return value === RETURN_TYPE ? RETURN_TYPE : ASSIGNMENT_TYPE
  }

  private static toCount(value: number | undefined): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0
  }
}
