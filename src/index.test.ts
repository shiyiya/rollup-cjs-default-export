import { Plugin, UserConfig, build } from 'vite'
import { describe, expect, it } from 'vitest'
import { plugin } from '.'

const mockEntry = (code) => ({
  name: 'mockEntry',
  enforce: 'pre',
  resolveId(id) {
    return id
  },
  load(id, options) {
    if (id.endsWith('virtual:module')) {
      return code
    }
  },
})

const resolveBundle = (cb: (code: string) => void) =>
  ({
    name: 'resolveBundle',
    enforce: 'post',
    transform(code, id, options) {
      cb(code)
    },
  } as Plugin)

const config = (code: string, cb: any) =>
  ({
    logLevel: 'silent',
    build: {
      sourcemap: false,
      minify: false,
      lib: {
        name: 'fire',
        entry: 'virtual:module',
        formats: ['umd', 'es', 'cjs', 'iife'],
      },
    },
    plugins: [mockEntry(code), plugin(), resolveBundle(cb)],
  } as UserConfig)

describe('main', async () => {
  it('export named and default', async () => {
    const code = `const jq = function(){};export default jq; const a = 1;export { a }`
    await build(
      config(code, (code) => {
        expect(code).toBe(`const jq = function(){};export default jq; const a = 1;jq.a = a`)
      })
    )
  })
})
