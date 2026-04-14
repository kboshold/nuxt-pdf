import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '.nuxt',
    '**/.nuxt/**',
    '.output',
    '**/.output/**',
    'dist',
    '**/dist/**',
    'node_modules',
    '**/node_modules/**',
    'public',
    '**/public/**',
    'docs',
    '**/docs/**',
    'local.concept',
    '**/local.concept/**',
    'local.concept_*',
    '**/local.concept_*/**',
  ],
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  vue: true,
  jsonc: false,
  yaml: false,
  rules: {
    'curly': ['error', 'all'],
    'style/brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      functions: 'always-multiline',
      exports: 'always-multiline',
      imports: 'always-multiline',
    }],
    'ts/consistent-type-definitions': ['error', 'interface'],
    'no-unused-expressions': ['error'],
    'no-param-reassign': ['error'],
    'no-fallthrough': ['error'],
    'ts/no-non-null-assertion': ['error'],
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'e18e/prefer-static-regex': 'off',
  },
}, {
  files: ['src/**/*.{ts,vue}'],
  rules: {
    'no-console': ['error'],
  },
})
