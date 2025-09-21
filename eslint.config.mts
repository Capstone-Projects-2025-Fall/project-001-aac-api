import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
  {
    files: ["**/*.{ts,js}"],
    ignores: [
      "dist/**",
      "node_modules/**", 
      "documentation/**",
      "build/**",
      "coverage/**",
      "*.d.ts"
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  {
    files: ["test/**/*.{ts,js}"],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
];