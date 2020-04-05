# pitlet-transform-vue

## Install

```sh
npm i -D @pitlet/transform-vue
```

## Usage

```js
// pitlet.config.js
const {
  transformVue,
  transformVueTemplate,
  transformVuePostTransformBlock,
} = require('@pitlet/transform-vue')
const { transformJsModule } = require('@pitlet/transform-js-module')

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-css': [transformVueStyle, transformVuePostTransformBlock],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
}
```
