## vite-plugin-merge-exports

Auto merge exports

```shell
npm i vite-plugin-merge-exports
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
