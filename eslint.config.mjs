import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  { files: ['internal/f02/browser-check.mjs'], languageOptions: { globals: {window:'readonly',document:'readonly',HTMLCanvasElement:'readonly'} } },
  { files: ['**/*.tsx'], plugins: { 'react-hooks': reactHooks }, rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' } },
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { process: "readonly" } } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
