import { transformCoffee } from './transformCoffee'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'square = (x) -> x * x',
    },
  }
  const transformed = await transformCoffee(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `var square;

square = function(x) {
  return x * x;
};
`,
      sourceMap: {
        file: '',
        mappings:
          'AAAA,IAAA;;AAAA,MAAA,GAAS,QAAA,CAAC,CAAD,CAAA;SAAO,CAAA,GAAI;AAAX',
        names: [],
        sourceRoot: '',
        sources: [],
        sourcesContent: ['square = (x) -> x * x'],
        version: 3,
      },
    },
  })
})
