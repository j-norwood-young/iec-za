import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            globals: globals.node,
        },
    },
);
