import {
  transformVueScript,
  transformVueStyle,
  transformVueTemplate,
  transformVue,
  transformVuePostTransformBlock,
} from '../src/index'
import {
  nodeBundler,
  collectAssets,
  createTransform,
} from '../../../core/src/index'
import * as path from 'path'

const transformCss = (api, options) => async asset => asset
const transformJsModule = (api, options) => async asset => asset

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  css: [transformCss],
}

;(async () => {
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform: createTransform({ transformFunctionMap }),
    entry: {
      protocol: 'filesystem',
      meta: {
        absolutePath: path.join(__dirname, 'src/index.js'),
      },
    },
  })
  console.log(assets)
})()
