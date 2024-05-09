## vite-plugin-merge-exports

Auto merge exports

```shell
npm i vite-plugin-merge-exports
```

```js
export { a, b }
export default named

// to
module.exports = named
module.default = named
named.a = a
named.b = b

const { a, b } = require('package')
```
