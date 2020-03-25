import * as fs from 'fs'
import * as path from 'path'
import {
  collectAssets,
  createTransform,
  nodeBundler,
} from '../../../core/src/index'
import { packageJs } from '../../../package/package-js/src/packageJs'
import { transformCss } from '../../transform-css/src/transformCss'
import { transformJsModule } from '../../transform-js-module/src/transformJsModule'
import {
  transformVue,
  transformVuePostTransformBlock,
  transformVueStyle,
  transformVueTemplate,
} from '../src/index'

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  css: [transformCss],
}
;(async () => {
  const entry = {
    protocol: 'filesystem',
    meta: {
      id: path.join(__dirname, 'src/index.js'),
    },
  }
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform: createTransform({ transformFunctionMap }),
    entry,
  })
  const packaged = await packageJs(assets, '', entry.meta.id)
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'))
  }
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
  // fs.writeFileSync(
  //   path.join(__dirname, 'out.json'),
  //   JSON.stringify(packaged, null, 2) + '\n',
  // )
  // console.log(assets)
  // assets //?
})()
