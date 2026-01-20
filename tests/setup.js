/**
 * Test Setup - Run before each test file
 * Sets up DOM mocks, global state, and loads actual source modules
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

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
  TIME_COSTS: {
    correct: 0.5,
    partial: 1.0,
    misguided: 1.5,
    wrong: 2.0,
  },
  PASS_THRESHOLD: 0.8,
};

// Mock console methods to prevent noise during tests (optional)
// global.console.log = () => {};

/**
 * Helper to load a source file and execute it in the global scope.
 * This allows testing window.* globals directly.
 * @param {string} relativePath - Path relative to project root
 */
export function loadSourceFile(relativePath) {
  const filePath = join(projectRoot, relativePath);
  const code = readFileSync(filePath, "utf-8");
  // Execute in global context
  const fn = new Function(code);
  fn.call(global);
}

/**
 * Helper to load multiple source files
 * @param {string[]} paths - Array of paths relative to project root
 */
export function loadSourceFiles(paths) {
  paths.forEach((p) => loadSourceFile(p));
}

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Clean up after all tests
afterAll(() => {
  localStorage.clear();
});
