module.exports = {
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
      rules: {
        "@html-eslint/require-doctype": "off",
        "@html-eslint/quotes": "off",
        "@html-eslint/element-newline": "off",
      },
    },
  ],
};
