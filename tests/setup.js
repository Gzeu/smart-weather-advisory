// Setup test environment
process.env.NODE_ENV = 'test';
process.env.OPENWEATHER_API_KEY = 'test_api_key';
process.env.GROQ_API_KEY = 'test_groq_key';
process.env.CACHE_TTL = '1';
process.env.PORT = '0'; // Use random port for tests

// Mock console for cleaner test output
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: () => {}, // Suppress logs during tests
  info: () => {},
  warn: originalConsole.warn,
  error: originalConsole.error
};