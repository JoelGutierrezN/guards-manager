import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SUPPORT_DIR = path.dirname(fileURLToPath(import.meta.url))
const MANAGER_DIR = path.resolve(SUPPORT_DIR, '..', '..')
const API_DIR = process.env.GUARDS_API_DIR
  ? path.resolve(process.env.GUARDS_API_DIR)
  : path.resolve(MANAGER_DIR, '..', 'guards-api')

const WEB_PORT = 5174
const API_PORT = 8100
const WEB_BASE_URL = `http://127.0.0.1:${WEB_PORT}`
const API_BASE_URL = `http://127.0.0.1:${API_PORT}`

export class E2eConfig {
  static readonly managerDir = MANAGER_DIR
  static readonly apiDir = API_DIR
  static readonly apiDatabasePath = path.join(API_DIR, 'database', 'e2e.sqlite')
  static readonly storageStatePath = path.join(MANAGER_DIR, 'e2e', '.auth', 'user.json')

  static readonly webPort = WEB_PORT
  static readonly apiPort = API_PORT
  static readonly webBaseUrl = WEB_BASE_URL
  static readonly apiBaseUrl = API_BASE_URL
  static readonly apiV1Url = `${API_BASE_URL}/api/v1`
  static readonly healthUrl = `${API_BASE_URL}/up`

  static readonly demoIdentifier = 'testuser'
  static readonly demoPassword = 'password'

  static readonly apiEnvironment: Record<string, string> = {
    DB_CONNECTION: 'sqlite',
    DB_DATABASE: path.join(API_DIR, 'database', 'e2e.sqlite'),
    SEED_DEMO_DATA: 'true',
    QUEUE_CONNECTION: 'sync',
  }

  static readonly webEnvironment: Record<string, string> = {
    VITE_API_URL: `${API_BASE_URL}/api/v1`,
  }
}
