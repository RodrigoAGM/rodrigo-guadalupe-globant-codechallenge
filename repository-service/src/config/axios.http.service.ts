/* eslint-disable no-use-before-define */
import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';
import { HttpService } from './http.service';
import { ApiResponse, RequestOptions } from '../@types';

/**
 * Axios service class to make http requests
 * @implements {HttpService}
 */
@injectable()
class AxiosService implements HttpService {
  private connection: AxiosInstance;

  private _baseUrl: string = '';

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;

    this.connection = axios.create({
      baseURL: this._baseUrl,
    });
  }

  async get<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const res = await this.connection.get(path, { ...options });
    return res.data;
  }
}

export { AxiosService };
