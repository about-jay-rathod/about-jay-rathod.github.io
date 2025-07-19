module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['node'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Error prevention
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'error',
    'no-undef': 'error',

    // Code style
    'prefer-const': 'error',
    'no-var': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': 'error',

    // Node.js specific
    'node/no-missing-require': 'error',
    'node/no-extraneous-require': 'error',

    // Best practices
    curly: 'error',
    eqeqeq: 'error',
    'no-throw-literal': 'error',
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
