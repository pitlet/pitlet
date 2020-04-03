import { transformJsWithUglifyJs } from './transformJsWithUglifyJs'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `function add(number1, number2){
  return number1 + number2
}`,
    },
  }
  const transformed = await transformJsWithUglifyJs(asset)
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
