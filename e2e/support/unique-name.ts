export class UniqueName {
  private static readonly processToken = process.pid.toString(36).toUpperCase()
  private static sequence = 0

  static runId(): string {
    if (!process.env.E2E_RUN_ID) {
      process.env.E2E_RUN_ID = Date.now().toString(36).toUpperCase()
    }
    return process.env.E2E_RUN_ID
  }

  static for(prefix: string): string {
    return `${prefix} E2E-${UniqueName.runId()}-${UniqueName.nextToken()}`
  }

  static email(prefix: string): string {
    return `${prefix}.${UniqueName.runId()}.${UniqueName.nextToken()}@e2e.test`.toLowerCase()
  }

  private static nextToken(): string {
    UniqueName.sequence += 1
    return `${UniqueName.processToken}${UniqueName.sequence}`
  }
}
