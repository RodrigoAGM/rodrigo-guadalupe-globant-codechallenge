import { AppError } from './app.error';
import { StatusCodes } from '../data/enum';

/**
 * Class used to build different GraphQL errors
 */
class ErrorBuilder {
  /**
   * Creates an Internal Server Error
   * @param {string} message Message to include on the error
   * @returns {AppError} An app error
   */
  static internalError = (message: string): AppError => new AppError({
    message, statusCode: StatusCodes.INTERNAL_ERROR,
  });

  /**
   * Creates a Bad Request Error
   * @param {string} message Message to include on the error
   * @returns {AppError} An app error
   */
  static badRequestError = (message: string): AppError => new AppError({
    message, statusCode: StatusCodes.BAD_REQUEST,
  });
}

export { ErrorBuilder };
