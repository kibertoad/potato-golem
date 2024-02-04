import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    passWithNoTests: true,
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [],
      reporter: ['lcov', "text", "html"],
      all: true,
    },
  },
})
