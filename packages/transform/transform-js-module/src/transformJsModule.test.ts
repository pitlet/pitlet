import { transformJsModule } from './transformJsModule'

test('import from node_modules', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import React from 'react'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `var _react = require("react");`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: ["import React from 'react'"],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: 'react',
          },
        },
      ],
    },
  })
})

test('relative import', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import foo from './foo'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `var _foo = require("./foo");`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: ["import foo from './foo'"],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: './foo',
          },
        },
      ],
    },
  })
})
