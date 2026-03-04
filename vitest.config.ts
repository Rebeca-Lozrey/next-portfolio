import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/modules/**/*.ts"],
      exclude: ["**/*.test.ts", "lib/modules/**/*.repository.ts"],
    },
  },
});
