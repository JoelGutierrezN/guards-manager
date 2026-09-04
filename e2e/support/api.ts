import { request, type APIRequestContext, type APIResponse } from '@playwright/test'
import { E2eConfig } from './config'
import { UniqueName } from './unique-name'
import type {
  AuthenticatedUser,
  CreateEmployeeInput,
  CreateProductInput,
  CreatedBrand,
  CreatedEmployee,
  CreatedProduct,
  CreatedProductModel,
  LoginResponse,
  RoleOption,
} from './api.model'

export class ApiClient {
  private readonly context: APIRequestContext
  private readonly authToken: string
  private readonly authenticatedUser: AuthenticatedUser

  private constructor(context: APIRequestContext, session: LoginResponse) {
    this.context = context
    this.authToken = session.token
    this.authenticatedUser = session.user
  }

  static async login(
    identifier: string = E2eConfig.demoIdentifier,
    password: string = E2eConfig.demoPassword,
  ): Promise<ApiClient> {
    const anonymousContext = await request.newContext()
    const response = await anonymousContext.post(ApiClient.endpoint('/login'), {
      data: { identifier, password },
    })
    const session = await ApiClient.readJson<LoginResponse>(response, 'POST /login')
    await anonymousContext.dispose()

    const authenticatedContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${session.token}`,
        Accept: 'application/json',
      },
    })

    return new ApiClient(authenticatedContext, session)
  }

  get token(): string {
    return this.authToken
  }

  get user(): AuthenticatedUser {
    return this.authenticatedUser
  }

  async createBrand(name: string = UniqueName.for('Marca')): Promise<CreatedBrand> {
    const response = await this.context.post(ApiClient.endpoint('/brands'), { data: { name } })
    return ApiClient.readJson<CreatedBrand>(response, 'POST /brands')
  }

  async createProductModel(
    brandId: string,
    name: string = UniqueName.for('Modelo'),
  ): Promise<CreatedProductModel> {
    const response = await this.context.post(ApiClient.endpoint('/product-models'), {
      data: { name, brand_id: brandId },
    })
    return ApiClient.readJson<CreatedProductModel>(response, 'POST /product-models')
  }

  async createProduct({
    brandId,
    productModelId,
    name = UniqueName.for('Herramienta'),
  }: CreateProductInput): Promise<CreatedProduct> {
    const response = await this.context.post(ApiClient.endpoint('/products'), {
      data: { name, brand_id: brandId, product_model_id: productModelId },
    })
    return ApiClient.readJson<CreatedProduct>(response, 'POST /products')
  }

  async createEmployee({
    roleId,
    name = UniqueName.for('Empleado'),
    email = UniqueName.email('empleado'),
    phone,
  }: CreateEmployeeInput): Promise<CreatedEmployee> {
    const response = await this.context.post(ApiClient.endpoint('/employees'), {
      data: { name, role_id: roleId, email, phone },
    })
    return ApiClient.readJson<CreatedEmployee>(response, 'POST /employees')
  }

  async firstRole(): Promise<RoleOption> {
    const response = await this.context.get(ApiClient.endpoint('/roles/select'))
    const roles = await ApiClient.readJson<RoleOption[]>(response, 'GET /roles/select')
    if (roles.length === 0) {
      throw new Error('El catálogo de puestos está vacío: revisa el seed de la API.')
    }
    return roles[0]
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
