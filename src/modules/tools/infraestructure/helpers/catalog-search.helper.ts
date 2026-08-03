import type { CatalogBrandNode } from '../../domain/catalog-option.model'

export class CatalogSearchHelper {
  static normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
  }

  static filter(brands: CatalogBrandNode[], query: string): CatalogBrandNode[] {
    const normalizedQuery = CatalogSearchHelper.normalize(query.trim())
    if (normalizedQuery === '') return brands

    return brands
      .map((brandNode) => {
        if (CatalogSearchHelper.normalize(brandNode.brand).includes(normalizedQuery)) {
          return brandNode
        }
        const matchingModels = brandNode.models.filter((model) =>
          CatalogSearchHelper.normalize(model.name).includes(normalizedQuery),
        )
        if (matchingModels.length === 0) return null
        return { ...brandNode, models: matchingModels }
      })
      .filter((brandNode): brandNode is CatalogBrandNode => brandNode !== null)
  }
}
