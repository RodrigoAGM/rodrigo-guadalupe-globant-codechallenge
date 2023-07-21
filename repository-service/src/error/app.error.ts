/**
 * Custom error class including status code
 */
class AppError extends Error {
  /**
 * HTTP Status code
 */
  statusCode: number;

  constructor(data: { message?: string, statusCode?: number }) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = data.message || 'Internal Server Error';
    this.statusCode = data.statusCode || 500;
  }
}

export { AppError };
