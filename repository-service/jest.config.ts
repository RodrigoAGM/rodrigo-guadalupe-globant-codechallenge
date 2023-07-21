import { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/__mocks__/prisma.mock.ts', '<rootDir>/tests/__mocks__/axios.mock.ts'],
};

export default config;
