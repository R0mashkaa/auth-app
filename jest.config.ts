import type { Config } from 'jest';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['dotenv/config'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '\\.d\\.ts$',
    '\\.js$',
    '/dist/',
    '/src/common',
    '/src/guards/',
    '/src/middlewares/',
  ],
};

export default config;
