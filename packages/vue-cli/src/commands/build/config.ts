import { transformVue } from 'transform-vue'
import { transformJsModule } from 'transform-js-module'

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule],
  'vue-css': [transformVueStyle],
  js: [transformJsModule],
  css: [],
}
