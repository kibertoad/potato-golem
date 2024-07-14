import { resolve } from 'node:path'

// @ts-ignore
import packageJson from './package.json'
import { builtinModules } from 'module'

import dts from 'vite-plugin-dts'
import { defineConfig, type UserConfig } from 'vitest/config'

export const extractDependencies = (packageJson: {
	dependencies?: Record<string, unknown>
	peerDependencies?: Record<string, unknown>
}) =>
	(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []).concat(
		packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : [])

/* eslint-disable import/no-default-export */
export default
	defineConfig({
		appType: 'custom',
		build: {
			target: 'esnext',
			lib: {
				entry: { index: resolve(__dirname, 'index.ts') },
			},
			rollupOptions: {
				output: [
					{
						format: 'es',
						preserveModules: true,
					},
					{
						format: 'cjs',
					},
				],
				external: Object.keys(packageJson.dependencies)
					.flatMap((dep) => [
						// This matches `import from 'my-package'`
						dep,
						// The `dep` above only covers root imports. In order to include sub-paths
						// from dependency, we need to add a regex that matches those as well.
						// This matches `import from 'my-package/sub/path'`
						new RegExp(`^${dep}/`),
					])
					.concat(builtinModules.flatMap((mod) => [mod, `node:${mod}`])),
				onwarn(warning) {
					throw Object.assign(new Error(), warning)
				},
			},
			commonjsOptions: {
				// Assumes all external dependencies are ESM dependencies. Just ensures
				// we then import those dependencies correctly in CJS as well.
				esmExternals: true,
			},
			sourcemap: true,
		},
		plugins: [
			dts({
				afterDiagnostic: (diagnosis) => {
					if (diagnosis.length > 0) {
						throw new Error('Issue while generating declaration files')
					}
				},
				include: ['src'],
			}),
		],
	})
