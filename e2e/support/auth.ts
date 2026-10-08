import fs from 'node:fs'
import path from 'node:path'
import { E2eConfig } from './config'
import type { AuthenticatedUser } from './api.model'
import type { StorageStateFile } from './auth.model'

export class AuthStorageState {
  static readonly filePath = E2eConfig.storageStatePath

  static build(token: string, user: AuthenticatedUser, expiresAt: string): StorageStateFile {
    return {
      cookies: [],
      origins: [
        {
          origin: E2eConfig.webBaseUrl,
          localStorage: [
            { name: 'access_token', value: JSON.stringify(token) },
            { name: 'access_token_expires_at', value: JSON.stringify(expiresAt) },
            { name: 'auth_user', value: JSON.stringify(user) },
          ],
        },
      ],
    }
  }

  static save(token: string, user: AuthenticatedUser, expiresAt: string): void {
    fs.mkdirSync(path.dirname(AuthStorageState.filePath), { recursive: true })
    fs.writeFileSync(
      AuthStorageState.filePath,
      `${JSON.stringify(AuthStorageState.build(token, user, expiresAt), null, 2)}\n`,
      'utf8',
    )
  }
}
