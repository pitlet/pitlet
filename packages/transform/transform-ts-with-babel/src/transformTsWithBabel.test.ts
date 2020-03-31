import { transformTsWithBabel } from './transformTsWithBabel'

test('import from node_modules', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      id: 'index.ts',
      content: `let x:number = 1`,
    },
  }
  const transformed = await transformTsWithBabel(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `let x = 1;`,
      id: 'index.ts',
      sourceMap: {
        version: 3,
        mappings: 'AAAA,IAAIA,CAAQ,GAAG,CAAf',
        names: ['x'],
        sources: ['index.ts'],
        sourcesContent: [`let x:number = 1`],
      },
    },
  })
})
