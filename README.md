## WIP

Auto merge cjs export

```js
export { a, b }
export default named

// to
module.export = named
named.a = a
named.b = b
```
