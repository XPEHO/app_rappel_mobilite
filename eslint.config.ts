import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // Ignore files here
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'src/shims-vue.d.ts']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // Add rules here
      'vue/block-lang': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'quotes': 'warn',
    },
  }
)
