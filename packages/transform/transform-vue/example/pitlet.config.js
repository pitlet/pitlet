const {
  transformVue,
  transformVueTemplate,
  transformVuePostTransformBlock,
} = require('../dist/index')
const { transformJsModule } = require('@pitlet/transform-js-module')
const { transformDocs } = require('./docs-loader')

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-docs': [transformDocs, transformJsModule],
}

module.exports = {
  transformFunctionMap,
}
