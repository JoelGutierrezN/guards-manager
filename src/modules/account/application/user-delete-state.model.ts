export interface UserDeleteTarget {
  id: string
  name: string
}

export interface UserDeleteState {
  target: UserDeleteTarget | null
  loading: boolean
  errorMessage: string | null
}

export const INITIAL_USER_DELETE_STATE: UserDeleteState = {
  target: null,
  loading: false,
  errorMessage: null,
}

export type UserDeleteAction =
  | { type: 'OPEN_CONFIRM'; target: UserDeleteTarget }
  | { type: 'CLOSE_CONFIRM' }
  | { type: 'ACTION_START' }
  | { type: 'ACTION_SUCCESS' }
  | { type: 'ACTION_ERROR'; message: string }
