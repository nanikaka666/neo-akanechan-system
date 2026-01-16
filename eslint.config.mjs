import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/webpack.rules.ts",
    "**/webpack.renderer.config.ts",
    "**/webpack.plugins.ts",
    "**/webpack.main.config.ts",
    "**/forge.config.ts",
    ".webpack/**/*.js",
    "./src/main/grpc/generated/**/*",
  ]),
  {
    extends: [
      ...fixupConfigRules(
        compat.extends(
          "eslint:recommended",
          "plugin:@typescript-eslint/eslint-recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:import/recommended",
          "plugin:import/electron",
          "plugin:import/typescript",
        ),
      ),
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"], // if React +17, need it
      reactHooksPlugin.configs.flat.recommended,
    ],

    settings: {
      react: {
        version: "detect", // for avoid warning.
      },
    },

    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
]);
