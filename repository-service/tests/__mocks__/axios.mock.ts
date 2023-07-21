/* eslint-disable no-undef */

const mockAxios: any = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
};

export { mockAxios };
