const fs = require('fs')
const path = require('path')
const {
  collectAssets,
  createTransform,
  nodeBundler,
} = require('../../../core/dist/index')
const { packageJs } = require('../../../package/package-js/dist/packageJs')
const { transformCss } = require('../../transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../transform-js-module/dist/transformJsModule')
const {
  transformVue,
  transformVuePostTransformBlock,
  transformVueStyle,
  transformVueTemplate,
} = require('../dist/index')
const { measureStart, measureEnd } = require('./measure')

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  css: [transformCss],
}

const entry = {
  protocol: 'filesystem',
  meta: {
    id: path.join(__dirname, 'src/index.js'),
  },
}

const alias = {
  vue: path.join(__dirname, 'web_modules', 'vue.js'),
}

const originalResolve = nodeBundler.resolve

nodeBundler.resolve = async (importee, importer) => {
  if (importee === 'vue') {
    return alias.vue
  }
  return originalResolve(importee, importer)
}
;(async () => {
  console.log(
    process.memoryUsage().heapUsed / (1024 * 1024) + 'MB memory usage',
  )
  measureStart('collect assets')
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform: createTransform({ transformFunctionMap }),
    entry,
  })
  measureEnd('collect assets')
  console.log(
    process.memoryUsage().heapUsed / (1024 * 1024) + 'MB memory usage',
  )
  // console.log(JSON.stringify(assets, null, 2))
  measureStart('package')
  const packaged = await packageJs(assets, '', entry.meta.id)
  measureEnd('package')
  measureStart('dist')
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'))
  }
  measureEnd('dist')
  measureStart('write')
  for (const operation of packaged) {
    switch (operation.type) {
      case 'write':
        fs.writeFileSync(
          path.join(__dirname, 'dist', operation.destinationPath),
          operation.content,
        )
        break
      default:
        console.log('not supported')
    }
  }
  measureEnd('write')
  // fs.writeFileSync(
  //   path.join(__dirname, 'out.json'),
  //   JSON.stringify(packaged, null, 2) + '\n',
  // )
  // console.log(assets)
  // assets //?

  console.log(
    process.memoryUsage().heapUsed / (1024 * 1024) + 'MB memory usage',
  )
})()
