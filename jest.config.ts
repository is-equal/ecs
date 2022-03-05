import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/*.ts'],
  coveragePathIgnorePatterns: ['index', '__tests__'],
  coverageProvider: 'v8',
  roots: ['<rootDir>/packages'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  preset: 'ts-jest',
  watchPathIgnorePatterns: ['/lib/', '/coverage/'],
};

export default config;
