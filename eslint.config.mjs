import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        ecmaVersion: 11,
        sourceType: "script",
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        quotes: ["error", "single"],
        semi: ["error", "always"],
    },
}]);