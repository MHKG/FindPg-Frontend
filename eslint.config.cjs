const reactPlugin = require('eslint-plugin-react');

module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'react/prop-types': 'off',
      // Warn on unused vars but ignore function args starting with '_' and
      // ignore variables that start with an uppercase letter (React components/imported components)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z]' }],
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
