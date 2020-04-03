import { transformJsWithTerser } from './transformJsWithTerser'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `function add(number1, number2){
  return number1 + number2
}`,
    },
  }
  const transformed = await transformJsWithTerser(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'function add(n,d){return n+d}',
      sourceMap: {
        version: 3,
        sources: ['0'],
        names: ['add', 'number1', 'number2'],
        mappings: 'AAAA,SAASA,IAAIC,EAASC,GACpB,OAAOD,EAAUC',
        file: 'index.js',
      },
    },
  })
})

test('with input sourceMap', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'console.log(1 /* ONE */ + 1 /* ONE */);',
      sourceMap: {
        version: 3,
        file: 'index.js',
        sources: ['src/index.ts'],
        sourcesContent: [
          `const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
`,
        ],
        names: [],
        mappings: 'AAEA,OAAO,CAAC,GAAG,CAAC,0BAA0B',
      },
    },
  }
  const transformed = await transformJsWithTerser(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'console.log(2);',
      sourceMap: {
        version: 3,
        file: 'index.js',
        mappings: 'AAEAA,QAAQC,IAAI',
        names: ['console', 'log'],
        sources: ['src/index.ts'],
        sourcesContent: [
          `const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
`,
        ],
      },
    },
  })
})
