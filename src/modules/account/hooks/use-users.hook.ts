import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { User } from '../domain/user.entity'
import type { CreateUserInput, UpdateUserInput } from '../domain/user-input.model'
import { usersReducer } from '../application/users.reducer'
import { usersRepository } from '../infraestructure/repositories/users.repository'
import { UserFormErrorHelper } from '../infraestructure/helpers/user-form-error.helper'
import {
  UserQueryParamsHelper,
  type UsersListRequest,
} from '../application/user-query-params.helper'

const SEARCH_DEBOUNCE_MS = 250

interface UsersWindowManager {
  window: 'create' | 'edit'
  payload: User | null
}

export function useUsers() {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(usersReducer, params, UserQueryParamsHelper.initialStateFrom)
  const { page, query } = state
  const requestRef = useRef<UsersListRequest>({ page, query })

  useEffect(() => {
    requestRef.current = { page, query }
  }, [page, query])

  useEffect(() => {
    setQueryParams(UserQueryParamsHelper.toParams({ page, query }))
  }, [page, query, setQueryParams])

  const load = useCallback(async (request: UsersListRequest) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await usersRepository.list(UserQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: 'No se pudo cargar a los usuarios.' })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({ page, query })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [page, query, load])

  const reloadList = useCallback(() => {
    void load(requestRef.current)
  }, [load])

  const setPage = useCallback(
    (nextPage: number) => dispatch({ type: 'SET_PAGE', page: nextPage }),
    [],
  )
  const setQuery = useCallback(
    (nextQuery: string) => dispatch({ type: 'SET_QUERY', query: nextQuery }),
    [],
  )
  const clearQuery = useCallback(() => dispatch({ type: 'SET_QUERY', query: '' }), [])

  const modal = useOverlayState()
  const [windowManager, setWindowManager] = useState<UsersWindowManager>({
    window: 'create',
    payload: null,
  })

  const openCreate = useCallback(() => {
    dispatch({ type: 'SAVE_DONE' })
    setWindowManager({ window: 'create', payload: null })
    modal.open()
  }, [modal])

  const openEdit = useCallback(
    (user: User) => {
      dispatch({ type: 'SAVE_DONE' })
      setWindowManager({ window: 'edit', payload: user })
      modal.open()
    },
    [modal],
  )

  const saveUser = useCallback(
    async (input: CreateUserInput | UpdateUserInput): Promise<string | null> => {
      const { window, payload } = windowManager
      dispatch({ type: 'SAVE_START' })
      try {
        if (window === 'edit' && payload != null) {
          const updated = await usersRepository.update(payload.id, input as UpdateUserInput)
          dispatch({ type: 'ROW_UPDATED', user: updated })
        } else {
          const created = await usersRepository.create(input as CreateUserInput)
          dispatch({ type: 'ROW_ADDED', user: created })
        }
        dispatch({ type: 'SAVE_DONE' })
        modal.close()
        return window === 'edit'
          ? `Usuario "${input.name}" actualizado`
          : `Usuario "${input.name}" creado`
      } catch (error) {
        dispatch({ type: 'SAVE_ERROR', message: UserFormErrorHelper.messageFrom(error) })
        return null
      }
    },
    [windowManager, modal],
  )

  const editingUser = windowManager.window === 'edit' ? windowManager.payload : null
  const modalKey = modal.isOpen ? `${windowManager.window}-${editingUser?.id ?? 'new'}` : 'closed'

  return {
    state,
    reloadList,
    setPage,
    setQuery,
    clearQuery,
    openCreate,
    openEdit,
    saveUser,
    editingUser,
    modalKey,
    modalOpen: modal.isOpen,
    closeModal: modal.close,
  }
}
