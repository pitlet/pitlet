const { transformJsonToJs } = require('../dist/transformJsonToJs')
const { transformJsModule } = require('@pitlet/transform-js-module')

const transformFunctionMap = {
  js: [transformJsModule],
  json: [transformJsonToJs, transformJsModule],
}

module.exports = {
  transformFunctionMap,
}
