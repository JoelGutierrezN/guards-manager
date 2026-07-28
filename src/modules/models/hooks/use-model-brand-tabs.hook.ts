import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BrandSelectOption } from '../../brands/domain/brand-select.model'
import { brandRepository } from '../../brands/infraestructure/repositories/brand.repository'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { TabItem } from '../../shared/infraestructure/components/ui/tabs.model'
import { ALL_BRANDS_TAB, MAX_BRAND_TABS, type BrandTabsStatus } from '../domain/brand-tabs.model'
import { BrandTabsHelper } from '../infraestructure/helpers/brand-tabs.helper'

export function useModelBrandTabs() {
  const { params, setQueryParams } = useQueryParams()
  const [options, setOptions] = useState<BrandSelectOption[]>([])
  const [status, setStatus] = useState<BrandTabsStatus>('loading')
  const [visibleIds, setVisibleIds] = useState<string[]>([])

  const selectedBrandId = params.brand != null ? String(params.brand) : ALL_BRANDS_TAB
  const initialBrandIdRef = useRef(selectedBrandId)

  useEffect(() => {
    let active = true
    brandRepository
      .select()
      .then((result) => {
        if (!active) return
        setOptions(result)
        setVisibleIds(BrandTabsHelper.initialVisibleIds(result, initialBrandIdRef.current))
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  const selectBrand = useCallback(
    (brandId: string) => {
      if (brandId !== ALL_BRANDS_TAB) {
        setVisibleIds((ids) => (ids.includes(brandId) ? ids : BrandTabsHelper.replaceLast(ids, brandId)))
      }
      setQueryParams({ brand: brandId === ALL_BRANDS_TAB ? undefined : brandId })
    },
    [setQueryParams],
  )

  const visibleBrands = useMemo(
    () =>
      visibleIds
        .map((id) => options.find((option) => option.id === id))
        .filter((option): option is BrandSelectOption => option != null),
    [visibleIds, options],
  )

  const hiddenBrands = useMemo(
    () => options.filter((option) => !visibleIds.includes(option.id)),
    [options, visibleIds],
  )

  const totalModels = useMemo(
    () => options.reduce((sum, option) => sum + option.modelsCount, 0),
    [options],
  )

  const tabItems = useMemo<TabItem[]>(
    () => [
      { value: ALL_BRANDS_TAB, label: 'Todas', count: totalModels },
      ...visibleBrands.map((brand) => ({
        value: brand.id,
        label: brand.name,
        count: brand.modelsCount,
      })),
    ],
    [visibleBrands, totalModels],
  )

  const selectedBrand = useMemo(
    () => options.find((option) => option.id === selectedBrandId) ?? null,
    [options, selectedBrandId],
  )

  const hasOverflow = options.length > MAX_BRAND_TABS

  return {
    status,
    tabItems,
    hiddenBrands,
    hasOverflow,
    selectedBrandId,
    selectedBrand,
    selectBrand,
  }
}
