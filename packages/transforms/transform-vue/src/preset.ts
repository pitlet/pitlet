import { transformVue } from './transform/transformVue'
import { transformVueTemplate } from './transform/transformVueTemplate'
import { transformVueStyle } from './transform/transformVueStyle'
import transformJsModule from '@bsp/transform-js-module'

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule],
  'vue-css': [transformVueStyle],
  js: [transformJsModule],
  css: [],
}
