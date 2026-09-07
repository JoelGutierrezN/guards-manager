export class UniqueName {
  private static sequence = 0

  static runId(): string {
    if (!process.env.E2E_RUN_ID) {
      process.env.E2E_RUN_ID = Date.now().toString(36).toUpperCase()
    }
    return process.env.E2E_RUN_ID
  }

  static for(prefix: string): string {
    UniqueName.sequence += 1
    return `${prefix} E2E-${UniqueName.runId()}-${UniqueName.sequence}`
  }

  static email(prefix: string): string {
    UniqueName.sequence += 1
    return `${prefix}.${UniqueName.runId()}.${UniqueName.sequence}@e2e.test`.toLowerCase()
  }
}
