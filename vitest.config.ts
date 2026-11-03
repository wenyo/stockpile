import path from "path";
import { defineConfig } from "vitest/config";

// 獨立於 vite.config.ts：測試不需要 React Router 與 PWA 外掛
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
