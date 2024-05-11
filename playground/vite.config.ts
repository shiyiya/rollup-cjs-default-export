import { defineConfig } from 'vite'
import { plugin } from '../src/index'

const config = defineConfig({
  build: {
    sourcemap: false,
    minify: false,
    lib: {
      name: 'fire',
      entry: './index.ts',
      formats: ['umd', 'es', 'cjs', 'iife'],
    },
  },
  plugins: [plugin()],
})

export default config
