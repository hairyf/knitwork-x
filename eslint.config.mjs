import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: [
    "docs/.docs"
  ],
  rules: {
    "unicorn/prefer-string-raw": "off",
  },
});