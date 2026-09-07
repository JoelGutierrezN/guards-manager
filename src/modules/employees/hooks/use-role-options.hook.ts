import { useEffect, useReducer, useRef } from 'react'
import { INITIAL_ROLE_OPTIONS_STATE } from '../application/role-options.model'
import { roleOptionsReducer } from '../application/role-options.reducer'
import { rolesRepository } from '../infraestructure/repositories/roles.repository'

export function useRoleOptions(enabled: boolean) {
  const [state, dispatch] = useReducer(roleOptionsReducer, INITIAL_ROLE_OPTIONS_STATE)
  const sequenceRef = useRef(0)

  useEffect(() => {
    if (!enabled || state.status !== 'idle') return
    const sequence = ++sequenceRef.current
    dispatch({ type: 'ROLES_START' })
    rolesRepository
      .select()
      .then((roles) => {
        if (sequence === sequenceRef.current) dispatch({ type: 'ROLES_SUCCESS', roles })
      })
      .catch(() => {
        if (sequence === sequenceRef.current) dispatch({ type: 'ROLES_ERROR' })
      })
  }, [enabled, state.status])

  return state
}
