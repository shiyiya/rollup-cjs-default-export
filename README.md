## vite-plugin-merge-exports

Auto merge exports

```shell
npm i vite-plugin-merge-exports
```

```ts
import { defineConfig } from 'vite'
import { plugin } from 'vite-plugin-merge-exports'

const config = defineConfig({
  build: {
    lib: {
      name: 'named',
      entry: './index.ts',
      formats: ['umd'],
    },
  },
  plugins: [plugin()],
})

export default config
```

```js
export { a, b as c }
export default named
export * from named
export * as d from named

// export const e = a.x

// to
module.exports = named
module.default = named
named.a = a
named.c = b
Object.assign(named, named)
name.d = named

const { a, b } = require('package')
```
