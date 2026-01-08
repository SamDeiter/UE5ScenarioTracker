import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use jsdom for DOM testing
    environment: "jsdom",

    // Test file patterns
    include: ["tests/**/*.test.js"],

    // Coverage settings
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["js/**/*.js", "simulator/js/**/*.js"],
      exclude: ["**/node_modules/**", "**/scenarios/**"],
    },

    // Global setup
    globals: true,

    // Setup files to run before each test
    setupFiles: ["./tests/setup.js"],
  },
});
