import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { BrandSelectOption } from '../../brands/domain/brand-select.model'
import { brandRepository } from '../../brands/infraestructure/repositories/brand.repository'
import type { ProductModel } from '../domain/product-model.entity'
import type { CreateProductModelInput } from '../domain/product-model-input.model'
import type { ProductModelNameCheck } from '../domain/product-model-name-check.model'
import type { NameCheckStatus, NewModelFormState } from '../application/new-model-form.model'
import { newModelFormReducer } from '../application/new-model-form.reducer'
import { productModelRepository } from '../infraestructure/repositories/product-model.repository'

const NAME_CHECK_DEBOUNCE_MS = 400

interface UseNewModelFormOptions {
  enabled: boolean
  brands: BrandSelectOption[]
  initialBrandId: string | null
  editModel: ProductModel | null
  onSave: (input: CreateProductModelInput) => void
}

function initialStateFrom({
  brands,
  initialBrandId,
  editModel,
}: UseNewModelFormOptions): NewModelFormState {
  const brandId = editModel?.brandId ?? initialBrandId ?? ''
  const brandName = editModel?.brandName ?? brands.find((brand) => brand.id === brandId)?.name ?? ''

  return {
    step: brandId !== '' ? 'name' : 'brand',
    brandSearch: '',
    brandId,
    brandName,
    brandDetail: null,
    brandDetailLoading: false,
    name: editModel?.name ?? '',
    checkStatus: 'idle',
    duplicateModel: null,
    similarModels: [],
    similarConfirmed: false,
  }
}

export function useNewModelForm(options: UseNewModelFormOptions) {
  const { enabled, brands, editModel, onSave } = options
  const [state, dispatch] = useReducer(newModelFormReducer, options, initialStateFrom)
  const checkSequenceRef = useRef(0)
  const detailSequenceRef = useRef(0)

  const filteredBrands = useMemo(() => {
    const query = state.brandSearch.trim().toLowerCase()
    if (query === '') return brands
    return brands.filter((brand) => brand.name.toLowerCase().includes(query))
  }, [brands, state.brandSearch])

  useEffect(() => {
    if (!enabled || state.brandId === '') return
    const sequence = ++detailSequenceRef.current
    dispatch({ type: 'BRAND_DETAIL_START' })
    brandRepository
      .detail(state.brandId)
      .then((brand) => {
        if (sequence === detailSequenceRef.current)
          dispatch({ type: 'BRAND_DETAIL_SUCCESS', brand })
      })
      .catch(() => {
        if (sequence === detailSequenceRef.current) dispatch({ type: 'BRAND_DETAIL_ERROR' })
      })
  }, [enabled, state.brandId])

  const classifyCheck = useCallback(
    (
      result: ProductModelNameCheck,
    ): {
      status: NameCheckStatus
      duplicateModel: NewModelFormState['duplicateModel']
      similarModels: NewModelFormState['similarModels']
    } => {
      const editId = editModel?.id ?? null
      const duplicateModel =
        result.exactMatch != null && result.exactMatch.id !== editId ? result.exactMatch : null
      const similarModels = result.similar.filter((model) => model.id !== editId)
      const status: NameCheckStatus =
        duplicateModel != null ? 'duplicate' : similarModels.length > 0 ? 'similar' : 'free'
      return { status, duplicateModel, similarModels }
    },
    [editModel],
  )

  const runNameCheck = useCallback(
    async (brandId: string, name: string): Promise<NameCheckStatus> => {
      const sequence = ++checkSequenceRef.current
      dispatch({ type: 'CHECK_START' })
      try {
        const result = await productModelRepository.nameCheck(brandId, name)
        const verdict = classifyCheck(result)
        if (sequence === checkSequenceRef.current) dispatch({ type: 'CHECK_RESULT', ...verdict })
        return verdict.status
      } catch {
        if (sequence === checkSequenceRef.current) {
          dispatch({
            type: 'CHECK_RESULT',
            status: 'error',
            duplicateModel: null,
            similarModels: [],
          })
        }
        return 'error'
      }
    },
    [classifyCheck],
  )

  useEffect(() => {
    const trimmedName = state.name.trim()
    if (!enabled || state.step !== 'name' || state.brandId === '' || trimmedName === '') return
    if (state.checkStatus !== 'idle') return
    const handle = setTimeout(() => {
      void runNameCheck(state.brandId, trimmedName)
    }, NAME_CHECK_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [enabled, state.step, state.brandId, state.name, state.checkStatus, runNameCheck])

  const setBrandSearch = useCallback(
    (search: string) => dispatch({ type: 'SET_BRAND_SEARCH', search }),
    [],
  )

  const selectBrand = useCallback((brand: BrandSelectOption) => {
    dispatch({ type: 'SELECT_BRAND', brandId: brand.id, brandName: brand.name })
  }, [])

  const backToBrand = useCallback(() => dispatch({ type: 'BACK_TO_BRAND' }), [])

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), [])

  const setSimilarConfirmed = useCallback(
    (confirmed: boolean) => dispatch({ type: 'SET_SIMILAR_CONFIRMED', confirmed }),
    [],
  )

  const submit = useCallback(async () => {
    const trimmedName = state.name.trim()
    if (state.brandId === '' || trimmedName === '') return
    if (state.checkStatus === 'duplicate' || state.checkStatus === 'checking') return
    if (state.checkStatus === 'similar' && !state.similarConfirmed) return

    const input: CreateProductModelInput = { name: trimmedName, brandId: state.brandId }

    if (state.checkStatus === 'free' || state.checkStatus === 'error') {
      onSave(input)
      return
    }

    const verdict = await runNameCheck(state.brandId, trimmedName)
    if (verdict === 'free' || verdict === 'error') onSave(input)
    if (verdict === 'similar' && state.similarConfirmed) onSave(input)
  }, [state.name, state.brandId, state.checkStatus, state.similarConfirmed, runNameCheck, onSave])

  const canSave = useMemo(() => {
    if (state.brandId === '' || state.name.trim() === '') return false
    if (state.checkStatus === 'duplicate' || state.checkStatus === 'checking') return false
    if (state.checkStatus === 'similar' && !state.similarConfirmed) return false
    return true
  }, [state.brandId, state.name, state.checkStatus, state.similarConfirmed])

  return {
    state,
    filteredBrands,
    setBrandSearch,
    selectBrand,
    backToBrand,
    setName,
    setSimilarConfirmed,
    submit,
    canSave,
  }
}
