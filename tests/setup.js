/**
 * Global test setup file
 * This file is run before all tests to configure the testing environment
 */

// Suppress noisy console methods in test output
// Vue dev mode prints info messages (devtools, production tips) that clutter results
global.console = {
  ...console,
  info: vi.fn(),
  // Uncomment to suppress console.log in tests
  // log: vi.fn(),
  // Uncomment to suppress console.debug in tests
  // debug: vi.fn(),
  // Keep warnings and errors visible
  warn: console.warn,
  error: console.error,
};

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage for tests
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.matchMedia (for responsive design tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
