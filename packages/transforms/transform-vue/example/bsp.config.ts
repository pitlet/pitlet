import * as path from 'path'
import {
  collectAssets,
  createTransform,
  nodeBundler,
} from '../../../core/src/index'
import { transformJsModule } from '../../transform-js-module'
import {
  transformVue,
  transformVuePostTransformBlock,
  transformVueStyle,
  transformVueTemplate,
} from '../src/index'

const transformCss = async asset => asset

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  css: [transformCss],
}

const typeMap = {
  vue: 'vue',
  js: 'js',
}
;(async () => {
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform: createTransform({ transformFunctionMap }),
    entry: path.join(__dirname, 'src/index.js'),
  })
  console.log(assets)
  assets //?
})()
