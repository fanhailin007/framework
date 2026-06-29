/**
 * @type {import('eslint').Linter.Config}
 * @description eslint配置，请勿修改
 * @author 孙丹
 * @date 2025-07-13
 *
 */
import pluginTs from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginEslintComments from 'eslint-plugin-eslint-comments'
import pluginImport from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

export default [
  // 忽略文件配置
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.min.js',
      '**/vendor/**',
      '**/coverage/**',
      '**/build/**',
      '**/public/**',
      '.git',
      'pnpm-lock.yaml',
    ],
  },

  // 基础配置 - 适用于所有JS/TS文件
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        defineOptions: 'writable',
      },
    },
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier: pluginPrettier,
      'eslint-comments': pluginEslintComments,
      import: pluginImport,
    },
    rules: {
      // Prettier规则
      'prettier/prettier': 'error',

      // JS通用规则
      'array-callback-return': 'off',
      'escape-case': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-restricted-imports': 'off',
      'no-return-await': 'off',
      'prefer-const': 'off',
      'prefer-template': 'error',
      camelcase: 'off',

      // ESLint注释插件规则
      'eslint-comments/no-unlimited-disable': 'off',

      // Import插件规则
      'import/order': 'off',
    },
  },

  // TypeScript特定规则
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-this-alias': 'off',
    },
  },

  // Vue文件特定规则
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/attributes-order': [
        'warn',
        {
          alphabetical: true,
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'any',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
        },
      ],
    },
  },

  // Unicorn插件规则
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/escape-case': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-this-assignment': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-array-some': 'off',
      'unicorn/prefer-default-parameters': 'off',
      'unicorn/prefer-dom-node-append': 'off',
      'unicorn/prefer-dom-node-remove': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-math-trunc': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-string-slice': 'off',
      'unicorn/prefer-structured-clone': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },

  // Element Plus相关规则
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    rules: {
      // Element Plus 相关规则
    },
  },
]
