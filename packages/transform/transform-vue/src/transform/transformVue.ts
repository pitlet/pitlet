import { parse } from '@vue/compiler-sfc'

const getFileName = asset => 'index.vue'

export const transformVue = async asset => {
  // console.log(asset)
  const { content, ...otherMeta } = asset.meta
  const { descriptor, errors } = parse(content, {
    sourceMap: true,
    filename: asset.meta.id,
  })
  if (errors.length) {
    throw new Error(errors[0].message)
  }
  const fileName = getFileName(asset)
  const directDependencies = []
  let templateImport = `const render = () => {}`
  let templateRequest
  if (descriptor.template) {
    const block = descriptor.template
    const blockLang = block.lang || 'html'
    const queryString = `?type=template&lang=${blockLang}`
    templateRequest = `./${fileName}${queryString}`
    templateImport = `import { render } from '${templateRequest}'`
    const blockType = `vue-${blockLang}`
    if (block.src) {
      directDependencies.push({
        protocol: 'filesystem',
        meta: {
          type: blockType,
          importee: block.src,
        },
      })
    } else {
      directDependencies.push({
        protocol: 'virtual',
        meta: {
          type: blockType,
          content: block.content,
          importee: templateRequest,
          id: `${asset.meta.id}${queryString}`,
        },
      })
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
    if (block.src) {
      directDependencies.push({
        protocol: 'filesystem',
        meta: {
          type: blockType,
          importee: block.src,
        },
      })
    } else {
      directDependencies.push({
        protocol: 'virtual',
        meta: {
          type: blockType,
          content: block.content,
          importee: scriptRequest,
          id: `${asset.meta.id}${queryString}`,
        },
      })
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
    if (block.src) {
      directDependencies.push({
        protocol: 'filesystem',
        meta: {
          type: blockType,
          importee: block.src,
        },
      })
    } else {
      directDependencies.push({
        protocol: 'virtual',
        meta: {
          type: blockType,
          content: block.content,
          importee: styleRequest,
          id: `${asset.meta.id}${queryString}`,
        },
      })
    }
  }
  let code = [
    templateImport,
    scriptImport,
    stylesCode,
    'script.render = render',
  ].join('\n')
  code += `\n\nexport default script`
  const transformed = {
    protocol: 'virtual',
    meta: {
      type: 'js',
      content: code,
      directDependencies,
      ...otherMeta,
    },
  }
  return transformed
}
