import Axios, { type AxiosInstance } from 'axios'
import { StorageService } from '../storage/local.storage'

export class HttpDataSource {
  private readonly client: AxiosInstance

  constructor(baseURL: string) {
    this.client = Axios.create({ baseURL })

    this.client.interceptors.request.use((config) => {
      const token = StorageService.get<string>('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
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
