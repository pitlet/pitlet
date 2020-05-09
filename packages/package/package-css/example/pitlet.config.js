const { packageCss } = require('../dist/packageCss')
const { packageJs } = require('../../package-js/dist/packageJs')
const { transformJsModule } = require('@pitlet/transform-js-module')

module.exports = {
  entryPath: `${__dirname}/src/index.js`,
  transformFunctionMap: {
    js: [transformJsModule],
    css: [],
  },
  packageFunctions: [packageJs, packageCss],
}
