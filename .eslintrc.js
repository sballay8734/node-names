// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "plugin:import/recommended", "plugin:import/typescript"],
  plugins: ["import"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
