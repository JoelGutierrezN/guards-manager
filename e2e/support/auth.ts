import fs from 'node:fs'
import path from 'node:path'
import { E2eConfig } from './config'
import type { AuthenticatedUser } from './api.model'
import type { StorageStateFile } from './auth.model'

export class AuthStorageState {
  static readonly filePath = E2eConfig.storageStatePath

  static build(token: string, user: AuthenticatedUser): StorageStateFile {
    return {
      cookies: [],
      origins: [
        {
          origin: E2eConfig.webBaseUrl,
          localStorage: [
            { name: 'access_token', value: JSON.stringify(token) },
            { name: 'auth_user', value: JSON.stringify(user) },
          ],
        },
      ],
    }
  }

  static save(token: string, user: AuthenticatedUser): void {
    fs.mkdirSync(path.dirname(AuthStorageState.filePath), { recursive: true })
    fs.writeFileSync(
      AuthStorageState.filePath,
      `${JSON.stringify(AuthStorageState.build(token, user), null, 2)}\n`,
      'utf8',
    )
  }
}
