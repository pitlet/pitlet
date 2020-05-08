import { packageCjs } from './packageCjs'

test('basic', async () => {
  const assets = [
    {
      protocol: 'virtual',
      meta: {
        type: 'js-module',
        id: `/test/index.js`,
        content: `const _add = require('./add')
const result = _add.add(1,2)`,
        directDependencies: [
          {
            protocol: 'filesystem',
            meta: { importee: './add.js' },
          },
        ],
        resolvedDirectDependencies: [
          {
            protocol: 'filesystem',
            meta: { id: '/test/add.js' },
          },
        ],
      },
    },
    {
      protocol: 'virtual',
      meta: {
        type: 'js-module',
        id: '/test/add.js',
        content: 'exports.add = (a,b) => a + b',
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ]
  const packaged = await packageCjs(assets, '/test', assets[0].meta.id)
  const main = packaged.find(
    (operation) => operation.destinationPath === 'main.js'
  )
  const mainMap = packaged.find(
    (operation) => operation.destinationPath === 'main.js.map'
  )
  expect(main).toEqual({
    type: 'write',
    destinationPath: 'main.js',
    content: `const modules = {
\"/test/index.js\": [(exports, require, module) => {
const _add = require('./add')
const result = _add.add(1,2)
},{\"./add.js\":\"/test/add.js\"}],
\"/test/add.js\": [(exports, require, module) => {
exports.add = (a,b) => a + b
},{}],

}
//# sourceMappingURL=./main.js.map

const entry = \"/test/index.js\"
const WebSocket = require('ws')
const moduleCache = Object.create(null)
const hmrCache = Object.create(null)

const require = id => {
  if(!modules[id]){
    throw new Error(\`cannot find module \"\${id}\"\`)
  }
  // if in cache, return the cached version
  if (moduleCache[id]) {
    return moduleCache[id]
  }
  const resolve = relativeImport => modules[id][1][relativeImport]
  const localRequire = relativeImport => {
    const resolved = resolve(relativeImport)
    if(!resolved){
      throw new Error(\`Cannot resolve module \"\${relativeImport}\" inside module \"\${id}\"\`)
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
    require(id)
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

const webSocket = new WebSocket('ws://localhost:4001')
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

require(entry)
`,
  })
  expect(mainMap).toEqual({
    type: 'write',
    destinationPath: 'main.js.map',
    content:
      '{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}',
  })
})
