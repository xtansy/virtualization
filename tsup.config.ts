import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // точка входа = публичный API либы
  format: ["esm"], // только ESM; при необходимости CJS добавить "cjs"
  dts: true, // генерируем .d.ts (типы для потребителей)
  clean: true, // чистим dist перед каждой сборкой
  sourcemap: true, // sourcemap для отладки у потребителя
  treeshake: true,
  target: "es2020",
  // react НЕ бандлим — это peer-зависимость. jsx-runtime тоже обязательно external,
  // иначе рантайм JSX уедет в бандл и у пользователя окажется два React.
  external: ["react", "react-dom", "react/jsx-runtime"],
});
