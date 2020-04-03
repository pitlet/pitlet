const { transformYmlToJson } = require('../dist/transformYmlToJson')
const {
  transformJsonToJs,
} = require('../../transform-json-to-js/dist/transformJsonToJs')

const transformFunctionMap = {
  yml: [transformYmlToJson, transformJsonToJs],
  js: [],
}

module.exports = {
  transformFunctionMap,
}
