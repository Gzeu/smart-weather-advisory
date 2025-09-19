export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  coverageReporters: [
    'text',
    'lcov'
  ],
  testTimeout: 10000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};