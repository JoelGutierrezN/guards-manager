import type { ComboboxItem } from '../../../shared/infraestructure/components/ui'
import { brandRepository } from '../repositories/brand.repository'
import type { BrandSelectOption } from '../../domain/brand-select.model'

export class BrandMergeOptionsHelper {
  static async loadTargets(query: string, excludeBrandId: string): Promise<ComboboxItem[]> {
    const brands = await brandRepository.select()
    const normalizedQuery = query.trim().toLowerCase()
    return brands
      .filter((brand) => brand.id !== excludeBrandId)
      .filter(
        (brand) => normalizedQuery === '' || brand.name.toLowerCase().includes(normalizedQuery),
      )
      .map((brand) => BrandMergeOptionsHelper.toItem(brand))
  }

  private static toItem(brand: BrandSelectOption): ComboboxItem {
    return {
      value: brand.id,
      label: brand.name,
      description: `${brand.modelsCount} ${brand.modelsCount === 1 ? 'modelo' : 'modelos'}`,
    }
  }
}
