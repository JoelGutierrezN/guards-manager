import { request, type APIRequestContext, type APIResponse } from '@playwright/test'
import { E2eConfig } from './config'
import type { CreatedCustody, CreatedStock, CreatedStockBatch } from './custody-api.model'

/** Alta de unidades y resguardos por API para preparar los escenarios de devolución. */
export class CustodyApi {
  private readonly context: APIRequestContext

  private constructor(context: APIRequestContext) {
    this.context = context
  }

  static async withToken(token: string): Promise<CustodyApi> {
    const context = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    return new CustodyApi(context)
  }

  async createStocks(
    productId: string,
    quantity: number,
    condition = 'NUEVO',
  ): Promise<CreatedStock[]> {
    const response = await this.context.post(CustodyApi.endpoint(`/products/${productId}/stocks`), {
      data: { quantity, condition },
    })
    const batch = await CustodyApi.readJson<CreatedStockBatch>(
      response,
      'POST /products/{id}/stocks',
    )
    return batch.created
  }

  async createCustody(employeeId: string, stocks: CreatedStock[]): Promise<CreatedCustody> {
    const response = await this.context.post(CustodyApi.endpoint('/custodies'), {
      data: {
        employee_id: employeeId,
        items: stocks.map((stock) => ({ stock_id: stock.id, condition: 'BUENO' })),
      },
    })
    return CustodyApi.readJson<CreatedCustody>(response, 'POST /custodies')
  }

  async dispose(): Promise<void> {
    await this.context.dispose()
  }

  private static endpoint(path: string): string {
    return `${E2eConfig.apiV1Url}${path}`
  }

  private static async readJson<T>(response: APIResponse, label: string): Promise<T> {
    if (!response.ok()) {
      throw new Error(`${label} respondió ${response.status()}: ${await response.text()}`)
    }
    return (await response.json()) as T
  }
}
