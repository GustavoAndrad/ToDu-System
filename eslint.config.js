import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "windows"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "prefer-const": "error",
      "no-var": "warn",
      "for-direction": "error"
    },
  }
];