import Axios, { type AxiosInstance } from 'axios'
import { StorageService } from '../storage/local.storage'
import { API_BASE_URL } from '../config/api.config'

export class HttpDataSource {
  private static instance: HttpDataSource | null = null
  private readonly client: AxiosInstance
  private onUnauthorized: (() => void) | null = null

  private constructor(baseURL: string) {
    this.client = Axios.create({ baseURL })

    this.client.interceptors.request.use((config) => {
      const token = StorageService.get<string>('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (Axios.isAxiosError(error) && error.response?.status === 401) {
          this.onUnauthorized?.()
        }
        return Promise.reject(error)
      },
    )
  }

  static getInstance(): HttpDataSource {
    if (!HttpDataSource.instance) {
      HttpDataSource.instance = new HttpDataSource(API_BASE_URL)
    }
    return HttpDataSource.instance
  }

  setUnauthorizedHandler(handler: (() => void) | null): void {
    this.onUnauthorized = handler
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url)
    return response.data
  }

  async post<T>(url: string, body?: object): Promise<T> {
    const response = await this.client.post<T>(url, body)
    return response.data
  }

  async put<T>(url: string, body?: object): Promise<T> {
    const response = await this.client.put<T>(url, body)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}
