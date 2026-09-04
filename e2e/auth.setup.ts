import { test as setup } from '@playwright/test'
import { ApiClient } from './support/api'
import { AuthStorageState } from './support/auth'

setup('prepara la sesión compartida', async () => {
  const api = await ApiClient.login()
  AuthStorageState.save(api.token, api.user)
  await api.dispose()
})
