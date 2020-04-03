import { transformYmlToJson } from './transformYmlToJson'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'hello: world',
    },
  }
  const transformed = await transformYmlToJson(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `{"hello":"world"}`,
    },
  })
})
