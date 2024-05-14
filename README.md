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
export default jq
export { a, b as c }
export * as d from jq


// export all in one
export default jq
jq.a = a;
jq.c = b
jq.d = jq
```
