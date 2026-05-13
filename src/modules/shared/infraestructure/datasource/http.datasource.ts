import Axios, { type AxiosInstance } from "axios";

export class HttpDataSource {
      private readonly client: AxiosInstance;
      private readonly baseURL: string;
      constructor(baseURL: string) {
            this.baseURL = baseURL;
            this.client = Axios.create({
                  baseURL: this.baseURL
            });
      }
      //TODO: add interceptors for auth token and error handling and improve all methods to return a custom response type with error handling
      get(url: string) {
            return this.client.get(url);
      }
      post(url: string, body: object) {
            return this.client.post(url, body)
      }
}