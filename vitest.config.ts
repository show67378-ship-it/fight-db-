import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/crawler/**/*.test.ts"],
    environment: "node",
  },
});
