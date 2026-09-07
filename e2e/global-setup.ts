import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { E2eConfig } from './support/config'
import { UniqueName } from './support/unique-name'

function ensureDatabaseFile(databasePath: string): void {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, '')
  }
}

export default function globalSetup(): void {
  UniqueName.runId()
  ensureDatabaseFile(E2eConfig.apiDatabasePath)

  execFileSync('php', ['artisan', 'migrate:fresh', '--seed', '--force'], {
    cwd: E2eConfig.apiDir,
    env: { ...process.env, ...E2eConfig.apiEnvironment },
    stdio: 'inherit',
  })
}
