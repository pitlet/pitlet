import _ from 'lodash'

const JS_MODULE_SYSTEM_CODE = `import {modules} from './modules.js'
export const moduleCache = Object.create(null)
export const require = id => {
  if(!modules[id]){
    throw new Error(\`cannot find module "\${id}"\`)
  }
  // if in cache, return the cached version
  if (moduleCache[id]) {
    return moduleCache[id]
  }
  const resolve = relativeImport => modules[id][1][relativeImport]
  const localRequire = relativeImport => require(resolve(relativeImport))
  const exports = {}
  // this will prevent infinite 'require' loop
  // from circular dependencies
  moduleCache[id] = exports
  // 'require'-ing the module,
  // exported stuff will assigned to 'exports'
  modules[id][0](exports, localRequire)
  return moduleCache[id]
}
`

const JS_RUNTIME_HMR_CODE = `import {modules} from './modules.js'
import {moduleCache, require} from './moduleSystem.js'
import {entry} from './entry.js'
const hmrApply = ({id, content, dependencyMap}) => {
  const fn = (exports, require) => eval(content)
  modules[id] = [fn, dependencyMap]
}
const webSocket = new WebSocket("ws://localhost:3000")
webSocket.onmessage = ({data}) => {
  const {command, payload} = JSON.parse(data)
  for(const transformedAsset of payload.transformedAssets){
    const {id, content} = transformedAsset.meta
    const oldModule = modules[id]
    if(!oldModule){
      throw new Error(\`cannot find module "\${id}"\`)
    }
    const dependencyMap = oldModule[1]
    hmrApply({id, content, dependencyMap})
    delete moduleCache[id]
  }
  delete moduleCache[entry]
  require(entry)
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

export const packageJs = async (assets, workspaceFolder, entryId) => {
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
    jsModulesCode += `"${jsAsset.meta.id}": [(exports, require) => {
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
