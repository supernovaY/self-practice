module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parser": "@typescript-eslint/parser", // Specifies the ESlint parser
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/camelcase": ["off", {properties: "always"}],
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "react-app",
    "plugin:prettier/recommended"
  ]
};