import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    passWithNoTests: true,
    globals: true,
    watch: false,
    environment: 'node',
  },
})
