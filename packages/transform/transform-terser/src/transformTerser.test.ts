import { transformTerser } from './transformTerser'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `function add(number1, number2){
  return number1 + number2
}`,
    },
  }
  const transformed = await transformTerser(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'function add(n,d){return n+d}',
    },
  })
})
