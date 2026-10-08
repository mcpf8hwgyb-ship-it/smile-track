import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { process: "readonly" } } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
