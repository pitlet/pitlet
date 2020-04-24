import { parse } from '@vue/compiler-sfc'

const getFileName = (asset) => 'index.vue'

const generateTemplateHotReloadCode = (id, templateRequest) => `
  module.hot.accept('${templateRequest}', () => {
    const {render} = require('${templateRequest}')
    api.rerender('${id}', render)
  })`

const generateScriptHotReloadCode = (id, scriptRequest) => `
  module.hot.accept('${scriptRequest}', () => {
    const script = require('${scriptRequest}').default
    script.render = render
    api.reload('${id}', script)
  })`
const generateHotReloadCode = (id, templateRequest, scriptRequest) => `

/* hot reload */
if(module.hot){
  script.__hmrId = '${id}'
  const api = __VUE_HMR_RUNTIME__
  if(!api.createRecord('${id}', script)){
    // console.log('vue api reload')
    api.reload('${id}', script)
  }
${templateRequest ? generateTemplateHotReloadCode(id, templateRequest) : ''}
${scriptRequest ? generateScriptHotReloadCode(id, scriptRequest) : ''}
}`
export const transformVue = async (asset) => {
  // console.log(asset)
  const { content, ...otherMeta } = asset.meta
  const { descriptor, errors } = parse(content, {
    sourceMap: true,
    filename: asset.meta.id,
  })
  if (errors.length) {
    // @ts-ignore
    console.log(JSON.stringify(errors[0].loc))
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
  let scriptRequest
  if (descriptor.script) {
    const block = descriptor.script
    const blockLang = block.lang || 'js'
    const queryString = `?type=script&lang=${blockLang}`
    scriptRequest = `./${fileName}${queryString}`
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
  const id = asset.meta.id
  code += generateHotReloadCode(id, templateRequest, scriptRequest)
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
