import { transformPreact } from './transformPreact'

test('import from node_modules', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import React from 'react'
const App = ()=> <h1>hello world</h1>`,
    },
  }
  const transformed = await transformPreact(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `import React from 'react';

const App = () => h(\"h1\", null, \"hello world\");`,
      sourceMap: {
        version: 3,
        mappings:
          'AAAA,OAAOA,KAAP,MAAkB,OAAlB;;AACA,MAAMC,GAAG,GAAG,MAAK,4BAAjB',
        names: ['React', 'App'],
        sources: ['unknown'],
        sourcesContent: [
          `import React from 'react'
const App = ()=> <h1>hello world</h1>`,
        ],
      },
    },
  })
})
