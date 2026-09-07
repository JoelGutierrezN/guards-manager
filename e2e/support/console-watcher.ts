import type { Page } from '@playwright/test'
import { IGNORED_CONSOLE_ERRORS } from './console-noise'

export class ConsoleWatcher {
  private readonly collected: string[] = []

  static attach(page: Page): ConsoleWatcher {
    const watcher = new ConsoleWatcher()

    page.on('console', (message) => {
      if (message.type() === 'error') {
        watcher.record(`console.error: ${message.text()}`)
      }
    })

    page.on('pageerror', (error) => {
      watcher.record(`pageerror: ${error.message}`)
    })

    return watcher
  }

  get errors(): string[] {
    return [...this.collected]
  }

  clear(): void {
    this.collected.length = 0
  }

  private record(entry: string): void {
    if (IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(entry))) return
    this.collected.push(entry)
  }
}
