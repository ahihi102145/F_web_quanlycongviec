import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Rules hiện có
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@mui/*/*/*'],
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Common Rules bổ sung
      'eqeqeq': ['error', 'always'], // Bắt buộc dùng === thay vì ==
      'no-console': ['warn'], // Cảnh báo khi dùng console.log
      'curly': ['error', 'all'], // Bắt buộc dùng dấu {} cho tất cả khối if/else/for
      'no-duplicate-imports': ['error'], // Ngăn import trùng lặp từ cùng module
      'prefer-const': ['error'], // Bắt buộc dùng const nếu biến không được gán lại
      'no-undef': ['error'], // Báo lỗi nếu biến không được định nghĩa
      
      'quotes': ['error', 'single', { avoidEscape: true }], // Bắt buộc dùng nháy đơn
      'comma-dangle': ['error', 'never'], // Không cho phép dấu phẩy thừa ở cuối object/array
      'object-curly-spacing': ['error', 'always'], // Yêu cầu khoảng trắng trong dấu {}
    },
  },
];