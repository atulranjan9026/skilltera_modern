module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-case-declarations': 'off',
    'no-extra-boolean-cast': 'off',
    'no-unsafe-optional-chaining': 'off',
    'react-refresh/only-export-components': 'off',
  },
}