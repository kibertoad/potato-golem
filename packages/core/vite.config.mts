import { resolve } from 'node:path'
import defineConfig, { extractDependencies } from '@potato-golem/library-vite-config/package'

// @ts-ignore
import packageJson from './package.json'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  entry: resolve('./index.ts'),
  dependencies: extractDependencies(packageJson),
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
