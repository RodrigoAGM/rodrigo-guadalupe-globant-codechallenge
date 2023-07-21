/* eslint-disable no-undef */

import { AppError } from '../../src/error/app.error';

describe('AppError tests', () => {
  it('should create custom AppError correctly', async () => {
    const appError = new AppError({ message: 'Test error', statusCode: 400 });

    expect(appError.message).toStrictEqual('Test error');
    expect(appError.statusCode).toStrictEqual(400);
  });

  it('should create AppError with default values correctly', async () => {
    const appError = new AppError({});

    expect(appError.message).toStrictEqual('Internal Server Error');
    expect(appError.statusCode).toStrictEqual(500);
  });
});
