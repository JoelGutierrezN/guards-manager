import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import { MAX_BRAND_TABS } from '../../domain/brand-tabs.model'

export class BrandTabsHelper {
  static initialVisibleIds(options: BrandSelectOption[], selectedId: string): string[] {
    const visibleIds = options.slice(0, MAX_BRAND_TABS).map((option) => option.id)
    const selectedExists = options.some((option) => option.id === selectedId)
    if (!selectedExists || visibleIds.includes(selectedId)) {
      return visibleIds
    }
    return BrandTabsHelper.replaceLast(visibleIds, selectedId)
  }

  static replaceLast(visibleIds: string[], brandId: string): string[] {
    return [...visibleIds.slice(0, -1), brandId]
  }
}
