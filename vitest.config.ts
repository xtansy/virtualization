import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // фейковый DOM: без него React негде рендерить
    setupFiles: ["./test/setup.ts"],
    css: false, // стилей в либе нет — не тратим время на обработку CSS
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/index.ts"],
    },
  },
});
