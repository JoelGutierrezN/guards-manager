import { defineConfig, devices } from '@playwright/test'
import { E2eConfig } from './e2e/support/config'

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  globalSetup: './e2e/global-setup.ts',
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: E2eConfig.webBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testMatch: /specs\/.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: E2eConfig.storageStatePath,
      },
    },
  ],
  webServer: [
    {
      command: `php artisan serve --host=127.0.0.1 --port=${E2eConfig.apiPort} --no-reload`,
      cwd: E2eConfig.apiDir,
      url: E2eConfig.healthUrl,
      env: E2eConfig.apiEnvironment,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120_000,
    },
    {
      command: `pnpm dev --host 127.0.0.1 --port ${E2eConfig.webPort} --strictPort`,
      cwd: E2eConfig.managerDir,
      url: E2eConfig.webBaseUrl,
      env: E2eConfig.webEnvironment,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120_000,
    },
  ],
})
