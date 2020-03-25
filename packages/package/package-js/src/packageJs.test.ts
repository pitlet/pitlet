import { packageJs } from './packageJs'

test('basic', async () => {
  const assets = [
    {
      protocol: 'virtual',
      meta: {
        type: 'js',
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
        type: 'js',
        id: '/test/add.js',
        content: 'exports.add = (a,b) => a + b',
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ]
  const packaged = await packageJs(assets, assets[1], '/test')
  expect(packaged).toEqual([
    {
      type: 'write',
      destinationPath: 'modules.js',
      content: `export const modules = {
"/test/index.js": [(exports, require) => {
const _add = require('./add')
const result = _add.add(1,2)
},{"./add.js":"/test/add.js"}],
"/test/add.js": [(exports, require) => {
exports.add = (a,b) => a + b
},{}],

}
//# sourceMappingURL=./modules.js.map
`,
    },
    {
      type: 'write',
      destinationPath: 'modules.js.map',
      content: `{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}`,
    },
  ])
})

test('empty file', async () => {
  const assets = [
    {
      protocol: 'virtual',
      meta: {
        type: 'js',
        id: '/test/index.js',
        content: '',
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ]
  const packaged = await packageJs(assets, assets[0], '/test')
  expect(packaged).toEqual([
    {
      type: 'write',
      destinationPath: 'modules.js',
      content: `export const modules = {
"/test/index.js": [(exports, require) => {

},{}],

}
//# sourceMappingURL=./modules.js.map
`,
    },
    {
      type: 'write',
      destinationPath: 'modules.js.map',
      content: `{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}`,
    },
  ])
})
