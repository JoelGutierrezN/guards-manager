import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useLoaderData, useParams } from 'react-router'
import type { CustodyDetailLoaderData } from '../domain/custody-detail-loader.model'
import { custodyDetailReducer } from '../application/custody-detail.reducer'
import { custodyDetailStateFrom } from '../application/custody-detail-state.model'
import { CustodyPresenter } from '../application/custody-presenter.helper'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'
import { CustodyErrorHelper } from '../infraestructure/helpers/custody-error.helper'

export function useCustodyDetail() {
  const loaderData = useLoaderData() as CustodyDetailLoaderData
  const { custodyId } = useParams<{ custodyId: string }>()
  const [state, dispatch] = useReducer(custodyDetailReducer, loaderData, custodyDetailStateFrom)

  useEffect(() => {
    dispatch({ type: 'HYDRATED', data: loaderData })
  }, [loaderData])

  const load = useCallback(async (targetCustodyId: string) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const custody = await custodiesRepository.get(targetCustodyId)
      dispatch({ type: 'LOAD_SUCCESS', custody })
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', error: CustodyErrorHelper.detailMessageFrom(error) })
    }
  }, [])

  const reload = useCallback(() => {
    if (custodyId == null) return
    void load(custodyId)
  }, [custodyId, load])

  const openCancelDialog = useCallback(() => dispatch({ type: 'CANCEL_DIALOG_OPENED' }), [])
  const closeCancelDialog = useCallback(() => dispatch({ type: 'CANCEL_DIALOG_CLOSED' }), [])

  const confirmCancel = useCallback(async (): Promise<string | null> => {
    if (custodyId == null) return null
    dispatch({ type: 'CANCEL_START' })
    try {
      await custodiesRepository.cancel(custodyId)
      dispatch({ type: 'CANCEL_DONE' })
      await load(custodyId)
      return 'Resguardo cancelado.'
    } catch (error) {
      dispatch({ type: 'CANCEL_ERROR', detail: CustodyErrorHelper.cancelDetailFrom(error) })
      return null
    }
  }, [custodyId, load])

  const { custody } = state

  const hero = useMemo(() => {
    if (custody == null) return { title: '', italic: '', lede: '' }
    return {
      title: CustodyPresenter.heroTitle(custody.code),
      italic: custody.code,
      lede: CustodyPresenter.heroLede(custody),
    }
  }, [custody])

  const canCancel = custody != null && CustodyPresenter.canBeCancelled(custody)
  const isNotFound = state.status === 'error' && CustodyErrorHelper.isNotFound(state.error ?? '')

  return {
    state,
    hero,
    canCancel,
    isNotFound,
    reload,
    openCancelDialog,
    closeCancelDialog,
    confirmCancel,
  }
}
