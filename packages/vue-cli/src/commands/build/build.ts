import * as path from 'path'
import { nodeBundler } from '../../../../core/dist/index'
import { transformCss } from '../../../../transform/transform-css/dist/transformCss'
import { transformJsModule } from '../../../../transform/transform-js-module/dist/transformJsModule'
import {
  transformVue,
  transformVuePostTransformBlock,
  transformVueStyle,
  transformVueTemplate,
} from '../../../../transform/transform-vue/dist/index'
import { nodeBundle } from './nodeBundle'

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  css: [transformCss],
}

export const build = async () => {
  const cwd = process.cwd()
  const web_modules = path.join(cwd, 'web_modules')
  const originalResolve = nodeBundler.resolve
  nodeBundler.resolve = async (importee, importer) => {
    if (importee === 'vue') {
      return path.join(web_modules, 'vue.js')
    }
    return originalResolve(importee, importer)
  }
  console.log('building...')
  await nodeBundle({
    workspaceFolder: cwd,
    transformFunctionMap,
  })

  console.log('done!')
}
