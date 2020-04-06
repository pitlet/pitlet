# pitlet-transform-ts-with-babel

## Install

```sh
npm i -D @pitlet/transform-ts-with-babel
```

## Usage

```js
// pitlet.config.js
const { transformJsModule } = require('@pitlet/transform-js-module')
const { transformTsWithBabel } = require('@pitlet/transform-ts-with-babel')

const transformFunctionMap = {
  js: [transformJsModule],
  ts: [transformTsWithBabel, transformJsModule],
}
```
