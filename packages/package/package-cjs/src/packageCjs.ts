import _ from 'lodash'

export const packageCjs = ({
  requiresWebsocket = false,
  webSocketPort = 3000,
}) => async (assets, workspaceFolder, entryId) => {
  const JS_CODE = `${requiresWebsocket ? `const WebSocket = require('ws')` : ''}
const moduleCache = Object.create(null)
const hmrCache = Object.create(null)

const pitletRequire = id => {
  if(!modules[id]){
    throw new Error(\`cannot find module "\${id}"\`)
  }
  // if in cache, return the cached version
  if (moduleCache[id]) {
    return moduleCache[id]
  }
  const resolve = relativeImport => modules[id][1][relativeImport]
  const localRequire = relativeImport => {
    const resolved = resolve(relativeImport)
    if(!resolved){
      throw new Error(\`Cannot resolve module "\${relativeImport}" inside module "\${id}"\`)
    }
    return pitletRequire(resolved)
  }
  const exports = {}
  // this will prevent infinite 'require' loop
  // from circular dependencies
  moduleCache[id] = exports
  hmrCache[id] = {
    accept: Object.create(null),
    dispose: Object.create(null),
  }
  // module object for hot-module-reloading
  const module = {
    hot: {
      accept: (file, fn) => hmrCache[id].accept[file] = fn,
      dispose: (file, fn) => hmrCache[id].dispose[file] = fn,
    },
    exports
  }
  // 'require'-ing the module,
  // exported stuff will assigned to 'exports'
  modules[id][0](exports, localRequire, module)
  moduleCache[id] = module.exports
  return moduleCache[id]
}
const getParentIds = id => Object.entries(modules).filter(([moduleId, [_, dependencyMap]]) => Object.values(dependencyMap).includes(id)).map(([moduleId, [_, dependencyMap]])=>moduleId)

/*
 * Checks wether or not a parent module calls \`module.hot.accept\`.
 * Only if it does, a hmr update can be applied. Otherwise the page has
 * to be reloaded.
 */
const willHmrBeAccepted = id => {
  const {accept} = hmrCache[id]
  if('.' in accept){
    return true
  }
  const parentIds = getParentIds(id)
  if(parentIds.length === 0){
    return false
  }
  return parentIds.every(parentId => {
    const {accept: parentAccept} = hmrCache[parentId]
    for(const [relativePath, fn] of Object.entries(parentAccept)){
      if(modules[parentId][1][relativePath] === id){
        return true
      }
    }
  })
}

/**
 * Runs the code to update the modules. It invokes the
 * callback functions provided by the user via
 * \`module.hot.accept\` to do so.
 */
const hmrRun = id => {
  const {accept} = hmrCache[id]
  delete moduleCache[id]
  if('.' in accept){
    // run self-accepting module
    pitletRequire(id)
  } else {
    const parentIds = getParentIds(id)
    for(const parentId of parentIds){
      const {accept: parentAccept} = hmrCache[parentId]
      for(const [relativePath, fn] of Object.entries(parentAccept)){
        if(modules[parentId][1][relativePath] === id){
          fn()
        }
      }
    }
  }
}

const webSocket = new WebSocket('ws://localhost:3000')
webSocket.onmessage = ({data}) => {
  const actions = JSON.parse(data)
  for(const {type, payload} of actions){
    switch (type) {
      case 'UPDATE_MODULE_CONTENT': {
        const {id, content} = payload
        modules[id][0] = (exports, require, module) => eval(content)
        delete moduleCache[id]
        if(willHmrBeAccepted(id)){
          const start = performance.now()
          try {
            hmrRun(id)
          } catch (error) {
            console.error('[HMR update failed]')
            console.error(error)
          }
          const end = performance.now()
        } else {
          window.location.reload()
        }
        break
      }
      case 'UPDATE_MODULE_DEPENDENCIES': {
        const {id, dependencyMap} = payload
        delete moduleCache[id]
        modules[id][1] = dependencyMap
        break
      }
      default: {
        console.warn(\`unknown message type \${type}\`)
        break
      }
    }
  }
}

const process = {
  env: {
    NODE_ENV: 'development'
  }
}

pitletRequire(entry)
`
  let jsModulesCode = `const modules = {\n`
  let lineOffset = 1
  const sourceRoot = workspaceFolder
  const sourceMap = {
    version: 3,
    file: 'modules.js',
    sections: [],
    sourceRoot,
  }
  for (const jsAsset of assets) {
    if (jsAsset.meta.type !== 'js-module') {
      continue
    }
    lineOffset += 1 // because of module start

    if (jsAsset.meta.sourceMap) {
      sourceMap.sections.push({
        offset: {
          line: lineOffset,
          column: 0,
        },
        map: {
          version: 3,
          file: jsAsset.meta.sourceMap.file,
          mappings: jsAsset.meta.sourceMap.mappings,
          names: jsAsset.meta.sourceMap.names,
          sources: jsAsset.meta.sourceMap.sources,
          sourcesContent: jsAsset.meta.sourceMap.sourcesContent,
          sourceRoot,
        },
      })
    }
    lineOffset += jsAsset.meta.content!.split('\n').length
    lineOffset += 1 // because of module end
    // const assetId = getAssetId(workspaceFolder, jsAsset.absolutePath)
    for (const directDependency of jsAsset.meta.directDependencies) {
      if (!directDependency.meta.importee) {
        // console.log(JSON.stringify(jsAsset.meta.directDependencies, null, 2))
        throw new Error('must have id')
      }
    }
    const dependencyMap = _.zipObject(
      jsAsset.meta.directDependencies!.map(
        (directDependency) => directDependency.meta.importee
      ),
      jsAsset.meta.resolvedDirectDependencies!.map(
        (resolvedDependency) => resolvedDependency.meta.id
      )
    )
    jsModulesCode += `"${jsAsset.meta.id}": [(exports, require, module) => {
${jsAsset.meta.content!}
},${JSON.stringify(dependencyMap)}],\n`
  }
  jsModulesCode += '\n}\n'
  const stringifiedSourceMap = JSON.stringify(sourceMap)
  jsModulesCode += `//# sourceMappingURL=./main.js.map`
  jsModulesCode += '\n'
  return [
    {
      type: 'write',
      destinationPath: 'main.js',
      content: `${jsModulesCode}\nconst entry = "${entryId}"\n${JS_CODE}`,
    },
    {
      type: 'write',
      destinationPath: 'main.js.map',
      content: stringifiedSourceMap,
    },
  ]
}
