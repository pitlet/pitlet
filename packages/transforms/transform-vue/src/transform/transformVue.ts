import { parse } from '@vue/compiler-sfc'

const getFileName = asset => 'index.vue'

export const transformVue = (api, options) => async asset => {
  const { descriptor, errors } = parse(asset.content, {
    sourceMap: true,
    filename: asset.id,
  })
  if (errors.length) {
    throw new Error(errors[0].message)
  }
  const fileName = getFileName(asset)
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
        meta: {
          type: blockType,
          importee: block.src,
        },
      }
    } else {
      importMapVirtual[templateRequest] = {
        protocol: 'virtual',
        meta: {
          type: blockType,
          content: block.content,
        },
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
    protocol: 'virtual',
    meta: {
      content: code,
      importMap,
      // directDependencies
      // importMapActual,
      // importMapVirtual,
    },
  }
  return transformed
}
