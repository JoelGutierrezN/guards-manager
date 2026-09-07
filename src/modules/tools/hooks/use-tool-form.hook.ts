import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ComboboxItem } from '../../shared/infraestructure/components/ui'
import { brandRepository } from '../../brands/infraestructure/repositories/brand.repository'
import { productModelRepository } from '../../models/infraestructure/repositories/product-model.repository'
import type { BrandSelectOption } from '../../brands/domain/brand-select.model'
import type { ProductModel } from '../../models/domain/product-model.entity'
import type { Tool } from '../domain/tool.entity'
import type { ToolFormSubmit } from '../application/tool-form.model'
import { ToolFormHelper } from '../application/tool-form.helper'
import { toolFormReducer } from '../application/tool-form.reducer'
import { ToolFormErrorHelper } from '../infraestructure/helpers/tool-form-error.helper'
import { ApiValidationErrorHelper } from '../../shared/infraestructure/errors/api-validation-error.helper'

const MODEL_OPTIONS_LIMIT = 10
const CREATE_BRAND_FALLBACK = 'No se pudo crear la marca.'
const CREATE_MODEL_FALLBACK = 'No se pudo crear el modelo.'

interface UseToolFormOptions {
  tool: Tool | null
  onSubmit: ToolFormSubmit
  onNotifyError: (message: string) => void
}

function toModelParams(brandId: string, query: string): URLSearchParams {
  const params = new URLSearchParams({ limit: String(MODEL_OPTIONS_LIMIT), state: 'activo' })
  if (brandId !== '') params.set('brand_id', brandId)
  if (query.trim() !== '') params.set('name', query.trim())
  return params
}

function toBrandItem(brand: BrandSelectOption): ComboboxItem {
  return {
    value: brand.id,
    label: brand.name,
    description: `${brand.modelsCount} ${brand.modelsCount === 1 ? 'modelo' : 'modelos'}`,
  }
}

function toModelItem(productModel: ProductModel): ComboboxItem {
  return { value: productModel.id, label: productModel.name, description: productModel.brandName }
}

export function useToolForm({ tool, onSubmit, onNotifyError }: UseToolFormOptions) {
  const [state, dispatch] = useReducer(toolFormReducer, tool, ToolFormHelper.initialStateFrom)
  const brandsCacheRef = useRef<BrandSelectOption[] | null>(null)

  const loadBrands = useCallback(async (): Promise<BrandSelectOption[]> => {
    if (brandsCacheRef.current === null) {
      brandsCacheRef.current = await brandRepository.select()
    }
    return brandsCacheRef.current
  }, [])

  useEffect(() => {
    if (tool === null || state.prefillStatus !== 'idle') return
    let isActive = true
    dispatch({ type: 'PREFILL_START' })
    productModelRepository
      .list(toModelParams('', tool.model))
      .then((page) => {
        if (!isActive) return
        const match =
          page.models.find(
            (productModel) =>
              productModel.name === tool.model && productModel.brandName === tool.brand,
          ) ?? null
        if (match === null) {
          dispatch({ type: 'PREFILL_ERROR' })
          return
        }
        dispatch({
          type: 'PREFILL_SUCCESS',
          prefill: {
            brandId: match.brandId,
            brandName: match.brandName,
            productModelId: match.id,
            productModelName: match.name,
          },
        })
      })
      .catch(() => {
        if (isActive) dispatch({ type: 'PREFILL_ERROR' })
      })
    return () => {
      isActive = false
    }
  }, [tool, state.prefillStatus])

  const loadBrandOptions = useCallback(
    async (query: string): Promise<ComboboxItem[]> => {
      const brands = await loadBrands()
      const normalizedQuery = query.trim().toLowerCase()
      const matches =
        normalizedQuery === ''
          ? brands
          : brands.filter((brand) => brand.name.toLowerCase().includes(normalizedQuery))
      return matches.map(toBrandItem)
    },
    [loadBrands],
  )

  const loadProductModelOptions = useCallback(
    async (query: string): Promise<ComboboxItem[]> => {
      if (state.brandId === '') return []
      const page = await productModelRepository.list(toModelParams(state.brandId, query))
      return page.models.map(toModelItem)
    },
    [state.brandId],
  )

  const selectBrand = useCallback((item: ComboboxItem | null) => {
    dispatch({ type: 'SET_BRAND', brandId: item?.value ?? '', brandName: item?.label ?? '' })
  }, [])

  const selectProductModel = useCallback((item: ComboboxItem | null) => {
    dispatch({
      type: 'SET_PRODUCT_MODEL',
      productModelId: item?.value ?? '',
      productModelName: item?.label ?? '',
    })
  }, [])

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), [])

  const createBrand = useCallback(
    async (name: string) => {
      try {
        const brand = await brandRepository.create({ name: name.trim() })
        brandsCacheRef.current = null
        dispatch({ type: 'SET_BRAND', brandId: brand.id, brandName: brand.name })
      } catch (error) {
        onNotifyError(ApiValidationErrorHelper.messageFrom(error, CREATE_BRAND_FALLBACK))
      }
    },
    [onNotifyError],
  )

  const createProductModel = useCallback(
    async (name: string) => {
      if (state.brandId === '') return
      try {
        const productModel = await productModelRepository.create({
          name: name.trim(),
          brandId: state.brandId,
        })
        dispatch({
          type: 'SET_PRODUCT_MODEL',
          productModelId: productModel.id,
          productModelName: productModel.name,
        })
      } catch (error) {
        onNotifyError(ApiValidationErrorHelper.messageFrom(error, CREATE_MODEL_FALLBACK))
      }
    },
    [state.brandId, onNotifyError],
  )

  const localErrors = useMemo(() => ToolFormHelper.validate(state), [state])

  const visibleErrors = useMemo(
    () => ToolFormHelper.mergeErrors(state.touched ? localErrors : {}, state.apiErrors),
    [state.touched, state.apiErrors, localErrors],
  )

  const canSave = useMemo(
    () => !ToolFormHelper.hasErrors(localErrors) && !state.isSaving,
    [localErrors, state.isSaving],
  )

  const submit = useCallback(async () => {
    dispatch({ type: 'TOUCH' })
    if (ToolFormHelper.hasErrors(localErrors) || state.isSaving) return
    dispatch({ type: 'SAVE_START' })
    try {
      await onSubmit(ToolFormHelper.toInput(state))
      dispatch({ type: 'SAVE_DONE' })
    } catch (error) {
      dispatch({
        type: 'SAVE_ERROR',
        errors: ToolFormErrorHelper.fieldErrorsFrom(error),
        message: ToolFormErrorHelper.messageFrom(error),
      })
    }
  }, [localErrors, state, onSubmit])

  return {
    state,
    visibleErrors,
    canSave,
    setName,
    selectBrand,
    selectProductModel,
    loadBrandOptions,
    loadProductModelOptions,
    createBrand,
    createProductModel,
    submit,
  }
}
