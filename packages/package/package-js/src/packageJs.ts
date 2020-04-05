import _ from 'lodash'

const JS_MODULE_SYSTEM_CODE = `import {modules} from './modules.js'
export const moduleCache = Object.create(null)
export const hmrCache = Object.create(null)

const hmrAcceptCheck = () => {

}

export const require = id => {
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
    return require(resolved)
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
    }
  }
  // 'require'-ing the module,
  // exported stuff will assigned to 'exports'
  modules[id][0](exports, localRequire, module)
  return moduleCache[id]
}
`

const JS_RUNTIME_HMR_CODE = `import {modules} from './modules.js'
import {moduleCache, hmrCache, require} from './moduleSystem.js'
import {entry} from './entry.js'

window.pitlet = window.pitlet || Object.create(null)
window.pitlet.modules = modules
window.pitlet.moduleCache = moduleCache
window.pitlet.hmrCache = hmrCache
window.pitlet.require = require

const getParentIds = id => Object.entries(modules).filter(([moduleId, [_, dependencyMap]]) => Object.values(dependencyMap).includes(id)).map(([moduleId, [_, dependencyMap]])=>moduleId)

window.pitlet.getParentIds = getParentIds

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

window.pitlet.willHmrBeAccepted = willHmrBeAccepted

/**
 * Runs the code to update the modules. It invokes the
 * callback functions provided by the user via
 * \`module.hot.accept\` to do so.
 */
const hmrRun = id => {
  const {accept} = hmrCache[id]
  delete moduleCache[id]
  if('.' in accept){
    console.log('run .')
    accept['.']()
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

window.pitlet.times=[]
window.pitlet.getAverage = () => {
  const array = window.pitlet.times
  const n = array.length;
  const mean = array.reduce((a,b) => a+b)/n;
  const s = Math.sqrt(array.map(x => Math.pow(x-mean,2)).reduce((a,b) => a+b)/n);
  return {
    mean,
    s
  }
}

window.pitlet.getLatestTimes = () => {
  return times.slice(-10).map(x=> x + 'ms').join(', ')
}

const webSocket = new WebSocket(\`ws://\${location.host}\`)
webSocket.onmessage = ({data}) => {
  const actions = JSON.parse(data)
  for(const {type, payload} of actions){
    switch (type) {
      case 'UPDATE_MODULE_CONTENT': {
        const {id, content} = payload
        modules[id][0] = (exports, require) => eval(content)
        delete moduleCache[id]
        if(willHmrBeAccepted(id)){
          const start = performance.now()
          hmrRun(id)
          const end = performance.now()
          window.pitlet.times.push(end-start)
          // console.log('hmr took'+(end-start)+'ms')
        } else {
          window.location.reload()
        }
        break
      }
      case 'UPDATE_MODULE_DEPENDENCIES': {
        const {id, dependencyMap} = payload
        delete moduleCache[id]
        modules[id][1] = dependencyMap
      }
      default: {
        console.warn(\`unknown message type \${type}\`)
        break
      }
    }
  }
}
`

const JS_RUNTIME_CODE = `import {entry} from './entry.js'
import {require} from './moduleSystem.js'
require(entry)
`

interface IndexSourceMap {
  readonly version: 3
  readonly file: string
  readonly sections: any[]
  readonly sourceRoot: string
}

export const packageJs = async (
  assets,
  workspaceFolder: string,
  entryId: string,
) => {
  let jsModulesCode = `export const modules = {\n`
  let lineOffset = 2
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
        directDependency => directDependency.meta.importee,
      ),
      jsAsset.meta.resolvedDirectDependencies!.map(
        resolvedDependency => resolvedDependency.meta.id,
      ),
    )
    jsModulesCode += `"${jsAsset.meta.id}": [(exports, require, module) => {
${jsAsset.meta.content!}
},${JSON.stringify(dependencyMap)}],\n`
  }
  jsModulesCode += '\n}\n'
  const stringifiedSourceMap = JSON.stringify(sourceMap)
  jsModulesCode += `//# sourceMappingURL=./modules.js.map`
  jsModulesCode += '\n'
  const jsEntryCode = `export const entry = "${entryId}"`
  return [
    {
      type: 'write',
      destinationPath: 'modules.js',
      content: jsModulesCode,
    },
    {
      type: 'write',
      destinationPath: 'modules.js.map',
      content: stringifiedSourceMap,
    },
    {
      type: 'write',
      destinationPath: 'moduleSystem.js',
      content: JS_MODULE_SYSTEM_CODE,
    },
    {
      type: 'write',
      destinationPath: 'entry.js',
      content: jsEntryCode,
    },
    {
      type: 'write',
      destinationPath: 'runtime.js',
      content: JS_RUNTIME_CODE,
    },
    {
      type: 'write',
      destinationPath: 'runtimeHmr.js',
      content: JS_RUNTIME_HMR_CODE,
    },
    {
      type: 'write',
      destinationPath: 'main.js',
      content: ['runtime.js', 'runtimeHmr.js']
        .map(runtime => `import './${runtime}'`)
        .join('\n'),
    },
  ]
}
