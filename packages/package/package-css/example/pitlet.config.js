const { packageCss } = require('../dist/packageCss')

module.exports = {
  entryPath: 'src/index.css',
  transformFunctionMap: {
    css: [],
  },
  packageFunctions: [packageCss],
}
