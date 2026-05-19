import { AppError } from '../errors/app.error.handler'

export class StorageService {
  static get<T> (key: string): T | null {
    try {
      const data = window.localStorage.getItem(key)

      if (!data) {
        return null
      }

      return JSON.parse(data) as T
    } catch (error) {
      throw new AppError({
        message: `Error trying to get storage key "${key}"`,
        code: 'STORAGE_GET_ERROR',
        details: error
      })
    }
  }

  static set<T> (key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      throw new AppError({
        message: `Error trying to set storage key "${key}"`,
        code: 'STORAGE_SET_ERROR',
        details: error
      })
    }
  }

  static remove (key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      throw new AppError({
        message: `Error trying to remove storage key "${key}"`,
        code: 'STORAGE_REMOVE_ERROR',
        details: error
      })
    }
  }

  static clear (): void {
    try {
      window.localStorage.clear()
    } catch (error) {
      throw new AppError({
        message: 'Error trying to clear storage',
        code: 'STORAGE_CLEAR_ERROR',
        details: error
      })
    }
  }
}
