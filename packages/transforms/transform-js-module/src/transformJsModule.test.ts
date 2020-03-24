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
      content: `var _react = require("react");`,
      directDependencies: ['react'],
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
      content: `var _foo = require("./foo");`,
      directDependencies: ['./foo'],
    },
  })
})
