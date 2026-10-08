import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useParams } from 'react-router'
import type { ItemCondition } from '../../shared/domain/item-condition.model'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { CustodyPresenter } from '../application/custody-presenter.helper'
import { ReturnFormHelper } from '../application/return-form.helper'
import { ReturnPresenter } from '../application/return-presenter.helper'
import { INITIAL_RETURN_STATE, type ReturnState } from '../application/return-state.model'
import { returnReducer } from '../application/return.reducer'
import type { CustodyItem } from '../domain/custody.entity'
import type { CustodyReturnType } from '../domain/custody-return-type.model'
import type { CustodyReturn } from '../domain/return.entity'
import { CustodyErrorHelper } from '../infraestructure/helpers/custody-error.helper'
import { ReturnErrorHelper } from '../infraestructure/helpers/return-error.helper'
import { ReturnNavigationHelper } from '../infraestructure/helpers/return-navigation.helper'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'

interface ReturnHero {
  title: string
  italic: string
  lede: string
}

interface UseReturnResult {
  state: ReturnState
  pendingItems: CustodyItem[]
  hero: ReturnHero
  previewType: CustodyReturnType
  canSubmit: boolean
  blockedMessage: string | null
  isNotFound: boolean
  reload: () => void
  setSelectedStockIds: (stockIds: string[]) => void
  setItemCondition: (stockId: string, condition: ItemCondition) => void
  setItemNotes: (stockId: string, notes: string) => void
  setNotes: (notes: string) => void
  submit: () => Promise<CustodyReturn | null>
}

const EMPTY_HERO: ReturnHero = { title: '', italic: '', lede: '' }

const ALREADY_RETURNED_MESSAGE = 'Este resguardo ya no tiene unidades pendientes de devolución.'
const CANCELLED_MESSAGE = 'Este resguardo está cancelado: ya no admite devoluciones.'

export function useReturn(): UseReturnResult {
  const { custodyId } = useParams<{ custodyId: string }>()
  const { params } = useQueryParams()
  const [state, dispatch] = useReducer(returnReducer, INITIAL_RETURN_STATE)

  const preselectedStockIds = useMemo(
    () => ReturnNavigationHelper.stockIdsFrom(params).join(','),
    [params],
  )

  const load = useCallback(
    async (targetCustodyId: string, requestedStockIds: string): Promise<void> => {
      dispatch({ type: 'LOAD_START' })
      try {
        const custody = await custodiesRepository.get(targetCustodyId)
        const pendingItems = ReturnFormHelper.pendingItems(custody)
        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            custody,
            drafts: ReturnFormHelper.initialDrafts(pendingItems),
            selectedStockIds: ReturnFormHelper.keepPending(
              requestedStockIds === '' ? [] : requestedStockIds.split(','),
              pendingItems,
            ),
          },
        })
      } catch (error) {
        dispatch({ type: 'LOAD_ERROR', payload: CustodyErrorHelper.detailMessageFrom(error) })
      }
    },
    [],
  )

  useEffect(() => {
    if (custodyId == null || custodyId === '') {
      dispatch({ type: 'LOAD_ERROR', payload: CustodyErrorHelper.notFoundMessage() })
      return
    }
    void load(custodyId, preselectedStockIds)
  }, [custodyId, preselectedStockIds, load])

  const reload = useCallback(() => {
    if (custodyId == null || custodyId === '') return
    void load(custodyId, preselectedStockIds)
  }, [custodyId, preselectedStockIds, load])

  const setSelectedStockIds = useCallback((stockIds: string[]) => {
    dispatch({ type: 'SELECTION_CHANGED', payload: stockIds })
  }, [])

  const setItemCondition = useCallback((stockId: string, condition: ItemCondition) => {
    dispatch({ type: 'ITEM_CONDITION_CHANGED', payload: { stockId, condition } })
  }, [])

  const setItemNotes = useCallback((stockId: string, notes: string) => {
    dispatch({ type: 'ITEM_NOTES_CHANGED', payload: { stockId, notes } })
  }, [])

  const setNotes = useCallback((notes: string) => {
    dispatch({ type: 'NOTES_CHANGED', payload: notes })
  }, [])

  const { custody, selectedStockIds, drafts, notes, status } = state

  const pendingItems = useMemo(() => ReturnFormHelper.pendingItems(custody), [custody])

  const previewType = useMemo(
    () => ReturnFormHelper.previewType(selectedStockIds.length, pendingItems.length),
    [selectedStockIds.length, pendingItems.length],
  )

  const hero = useMemo<ReturnHero>(() => {
    if (custody === null) return EMPTY_HERO
    return {
      title: `Devolución del resguardo ${custody.code}`,
      italic: custody.code,
      lede: ReturnPresenter.heroLede(custody.code, pendingItems.length),
    }
  }, [custody, pendingItems.length])

  const submit = useCallback(async (): Promise<CustodyReturn | null> => {
    if (custodyId == null || custody === null || status !== 'editing') return null

    if (selectedStockIds.length === 0) {
      dispatch({ type: 'SUBMIT_ERROR', payload: ReturnErrorHelper.emptySelectionReport() })
      return null
    }

    const missingNoteStockIds = ReturnFormHelper.missingNoteStockIds(selectedStockIds, drafts)
    if (missingNoteStockIds.length > 0) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: ReturnErrorHelper.missingNotesReport(missingNoteStockIds),
      })
      return null
    }

    dispatch({ type: 'SUBMIT_START' })
    try {
      const createdReturn = await custodiesRepository.createReturn(
        custodyId,
        ReturnFormHelper.toInput(selectedStockIds, drafts, notes),
      )
      dispatch({ type: 'SUBMIT_SUCCESS', payload: createdReturn })
      return createdReturn
    } catch (error) {
      /** Un 404 aquí es un resguardo cancelado entre la carga y el envío: el formulario se cierra. */
      if (ReturnErrorHelper.isNotFound(error)) {
        dispatch({ type: 'LOAD_ERROR', payload: ReturnErrorHelper.notFoundMessage() })
        return null
      }
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: ReturnErrorHelper.reportFrom(error, selectedStockIds),
      })
      return null
    }
  }, [custodyId, custody, status, selectedStockIds, drafts, notes])

  const blockedMessage = useMemo<string | null>(() => {
    if (custody === null || CustodyPresenter.canRegisterReturn(custody)) return null
    return custody.pendingItemsCount === 0 ? ALREADY_RETURNED_MESSAGE : CANCELLED_MESSAGE
  }, [custody])

  const canSubmit = status === 'editing' && selectedStockIds.length > 0 && blockedMessage === null
  const isNotFound = status === 'error' && CustodyErrorHelper.isNotFound(state.loadError ?? '')

  return {
    state,
    pendingItems,
    hero,
    previewType,
    canSubmit,
    blockedMessage,
    isNotFound,
    reload,
    setSelectedStockIds,
    setItemCondition,
    setItemNotes,
    setNotes,
    submit,
  }
}
