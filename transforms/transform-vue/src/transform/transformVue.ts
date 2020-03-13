import {
  TransformApi,
  Transform,
  ChildAssetActual,
  ChildAssetVirtual,
  TransformedAsset,
} from '../types'
import { parse } from '@vue/compiler-sfc'

interface Api {
  readonly getFileName: TransformApi['getFileName']
}

interface Options {}

export const transformVue: Transform<Api, Options> = (
  api,
  options,
) => async asset => {
  const { descriptor, errors } = parse(asset.content, {
    sourceMap: true,
    filename: asset.id,
  })
  if (errors.length) {
    throw new Error(errors[0].message)
  }
  const fileName = api.getFileName(asset)
  const importMapActual: { [key: string]: ChildAssetActual } = Object.create(
    null,
  )
  const importMapVirtual: { [key: string]: ChildAssetVirtual } = Object.create(
    null,
  )
  let templateImport = `const render = () => {}`
  let templateRequest
  if (descriptor.template) {
    const block = descriptor.template
    const blockLang = block.lang || 'html'
    const queryString = `?type=template&lang=${blockLang}`
    templateRequest = `./${fileName}${queryString}`
    templateImport = `import { render } from '${templateRequest}'`
    const blockType = `vue-${blockLang}`
    const blockId = `${asset.id}${queryString}`
    if (block.src) {
      importMapActual[templateRequest] = {
        protocol: 'filesystem',
        type: blockType,
        importee: block.src,
      }
    } else {
      importMapVirtual[templateRequest] = {
        protocol: 'virtual',
        type: blockType,
        content: block.content,
      }
    }
  }
  let scriptImport = `const script = {}`
  if (descriptor.script) {
    const block = descriptor.script
    const blockLang = block.lang || 'js'
    const queryString = `?type=script&lang=${blockLang}`
    const scriptRequest = `./${fileName}${queryString}`
    scriptImport = `import script from '${scriptRequest}'\n`
    const blockType = `vue-${blockLang}`
    const blockId = `${asset.id}${queryString}`
    if (block.src) {
      importMapActual[scriptRequest] = {
        type: blockType,
        id: blockId,
        importee: block.src,
      }
    } else {
      importMapVirtual[scriptRequest] = {
        type: blockType,
        id: blockId,
        content: block.content,
      }
    }
  }
  let stylesCode = ``
  for (let i = 0; i < descriptor.styles.length; i++) {
    const block = descriptor.styles[i]
    const blockLang = block.lang || 'css'
    const queryString = `?type=style&index=${i}&lang=${blockLang}`
    const styleRequest = `./${fileName}${queryString}`
    stylesCode += `\nimport '${styleRequest}'`
    const blockType = `vue-${blockLang}`
    const blockId = `${asset.id}${queryString}`
    if (block.src) {
      importMapActual[styleRequest] = {
        type: blockType,
        id: blockId,
        importee: block.src,
      }
    } else {
      importMapVirtual[styleRequest] = {
        type: blockType,
        id: blockId,
        content: block.content,
      }
    }
  }
  let code = [
    templateImport,
    scriptImport,
    stylesCode,
    'script.render = render',
  ].join('\n')
  code += `\n\nexport default script`
  const transformed: TransformedAsset = {
    id: asset.id,
    content: code,
    importMapActual,
    importMapVirtual,
  }
  return transformed
}
