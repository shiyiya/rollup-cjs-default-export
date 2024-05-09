import { defineConfig } from 'vite'
import { cjs } from '../src/index'

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
  plugins: [cjs()],
})

export default config
