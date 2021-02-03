import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import postcss from 'rollup-plugin-postcss'

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import zip from 'rollup-plugin-zip'

const isProduction = process.env.NODE_ENV === 'production'

// Aliases for module resolution
const aliases = isProduction
  ? [
      {
        find: 'react',
        // Use the production build
        replacement: require.resolve('react/esm/react.production.min.js'),
      },
      {
        find: 'react-dom',
        // Use the production build
        replacement: require.resolve(
          'react-dom/esm/react-dom.production.min.js',
        ),
      },
    ]
  : []

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
  plugins: [
    postcss(),
    chromeExtension(),
    // Adds a Chrome extension reloader during watch mode
    simpleReloader(),
    alias({ entries: aliases }),
    resolve(),
    commonjs(),
    typescript(),
    // Empties the output dir before a new build
    emptyDir(),
    // Outputs a zip file in ./releases
    isProduction && zip({ dir: 'releases' }),
  ],
}
