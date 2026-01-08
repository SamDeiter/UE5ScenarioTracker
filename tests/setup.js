/**
 * Test Setup - Run before each test file
 * Sets up DOM mocks and global state
 */

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: function (key) {
    return this.store[key] || null;
  },
  setItem: function (key, value) {
    this.store[key] = String(value);
  },
  removeItem: function (key) {
    delete this.store[key];
  },
  clear: function () {
    this.store = {};
  },
};

global.localStorage = localStorageMock;

// Mock window.APP_CONFIG
global.APP_CONFIG = {
  TOTAL_TEST_TIME_SECONDS: 1800,
  LOW_TIME_WARNING_SECONDS: 300,
  DEBUG_PASSWORD: "testpass",
};

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Clean up after all tests
afterAll(() => {
  localStorage.clear();
});
