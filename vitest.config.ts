import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    sequence: {
      shuffle: {
        files: true,
        tests: true,
      },
    },
    include: ["**/test/**/*.test.{ts,tsx}"],
  },
});
