/* eslint-disable no-unused-vars */
import { ApiResponse, RequestOptions } from '../@types';

/**
 * HTTPService service interface
 */
interface HttpService {
  /**
   * Executes a http get request.
   * @param {string} path - Path of the request.
   * @param {RequestOptions} [options] - Optional request options for the request. (Optional)
   * @returns {Promise<ApiResponse<T>>} Promise with the request response.
   */
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;

}

export { HttpService };
