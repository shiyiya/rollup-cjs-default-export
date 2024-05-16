import { Plugin, UserConfig, build } from 'vite'
import { describe, expect, it } from 'vitest'
import { plugin } from '.'

const mockEntry = (code: string) =>
  <Plugin>{
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
  }

const resolveBundle = (cb: (code: string) => void) =>
  <Plugin>{
    name: 'resolveBundle',
    enforce: 'post',
    transform(code, id, options) {
      cb(code)
    },
  }

const config = (code: string, cb: (code: string) => void) =>
  ({
    logLevel: 'silent',
    build: {
      sourcemap: false,
      minify: false,
      lib: {
        name: 'fire',
        entry: 'virtual:module',
        formats: ['umd'],
      },
    },
    plugins: [mockEntry(code), plugin(), resolveBundle(cb)],
  } as UserConfig)

describe('main', async () => {
  it('export default jq; export { a }', async () => {
    const code = `const jq = function(){};export default jq; const a = 1;export { a }`
    await build(
      config(code, (code) => {
        expect(code).toBe(`const jq = function(){};export default jq; const a = 1;jq.a = a`)
      })
    )
  })

  it('export { jq as default, a }', async () => {
    const code = `const jq = function(){};const a = 1;export { jq as default, a };`
    await build(
      config(code, (code) => {
        expect(code).toBe(`const jq = function(){};const a = 1;export { jq as default };\r\njq.a = a`)
      })
    )
  })
})
