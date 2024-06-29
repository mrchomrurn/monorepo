import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
  {
    ignores: ['dist/*'],
    rules: {
      'no-console': 'warn',
      'antfu/top-level-function': 'off',
      'antfu/if-newline': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 2 }],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/define-props-declaration': ['error', 'type-based'],
      'style/object-curly-newline': ['error', { consistent: true, multiline: true }],
    },
  },
  ...compat.config({ extends: ['plugin:tailwindcss/recommended', 'plugin:@tanstack/eslint-plugin-query/recommended'] },
  ),
  { rules: { 'tailwindcss/no-custom-classname': 'off' } },
)
