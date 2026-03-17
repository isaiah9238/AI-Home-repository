import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import googleConfig from "eslint-config-google";

export default [
  {
    // 1. This replaces your ignorePatterns
    ignores: ["lib/**/*", "generated/**/*", "**/node_modules/**"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
      },
      globals: {
        node: true,
        es6: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
    },
    // 2. We manually apply the rules since "extends" works differently now
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...googleConfig.rules,
      "quotes": ["error", "double"],
      "import/no-unresolved": 0,
      "indent": ["error", 2],
      "object-curly-spacing": ["error", "always"], // Often required by Google style
    },
  }
];