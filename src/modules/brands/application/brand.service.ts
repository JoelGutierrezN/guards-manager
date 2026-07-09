import type { Brand } from '../domain/brand.entity'

export class BrandService {
  static usagePercent(assigned: number, total: number): number {
    if (total <= 0) return 0
    return Math.min(100, Math.round((assigned / total) * 100))
  }

  static totalModels(brands: Brand[]): number {
    return brands.reduce((sum, brand) => sum + brand.modelsCount, 0)
  }

  static totalTools(brands: Brand[]): number {
    return brands.reduce((sum, brand) => sum + brand.toolsTotal, 0)
  }
}
