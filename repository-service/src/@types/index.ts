/**
 * Determines that the attribute could be of the provided generic type or null.
 */
type Maybe<T> = T | null;

/**
 * Api response with data of provided generic type.
 */
type ApiResponse<T> = {
  /**
   * Determines if the request was successful.
   */
  success: boolean;
  /**
   * Message included on the Api response. Could be null.
   */
  message?: Maybe<string>;
  /**
   * Data received from the request. Type is determined by provided generic type.
   */
  data: T;
};

/**
 * Requests options provided for HTTP requests.
 */
type RequestOptions = {
  /**
   * Object with HTTP params to include in the request
   */
  params?: { [key: string]: number | string | boolean };
  /**
   * Object with HTTP headers to include in the request
   */
  headers?: { [key: string]: number | string | boolean };
  nextOptions?: object;
};

export {
  ApiResponse, Maybe, RequestOptions,
};
