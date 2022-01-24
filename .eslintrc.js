module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'no-param-reassign': 'off',
    'vue/no-v-for-template-key': 'off',
    'import/extensions': 'off',
    'import/no-extensions': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-bitwise': 'off',
    'max-len': ['error', { code: 200 }],
    'vue/no-v-model-argument': 'off',
  },
};
