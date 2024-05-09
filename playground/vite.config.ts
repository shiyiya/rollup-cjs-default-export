import { defineConfig } from 'vite'
import { cjs } from '../src/index'

const config = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: 'fire',
      entry: './index.ts',
      formats: ['umd', 'es'],
    },
  },
  plugins: [cjs()],
})

export default config
