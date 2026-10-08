import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { DashboardOverview } from '../../domain/dashboard-overview.model'
import type { DashboardRepository as DashboardRepositoryContract } from '../../domain/dashboard-repository'
import type { DashboardOverviewDto } from '../dto/dashboard.dto'
import { DashboardMapper } from '../mappers/dashboard.mapper'

const DASHBOARD_PATH = '/dashboard'

class DashboardRepositoryImpl implements DashboardRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async getOverview(): Promise<DashboardOverview> {
    const response = await this.datasource.get<DashboardOverviewDto>(DASHBOARD_PATH)
    return DashboardMapper.toOverview(response)
  }
}

export const dashboardRepository = new DashboardRepositoryImpl()
