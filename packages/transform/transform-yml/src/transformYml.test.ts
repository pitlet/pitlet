import { transformYml } from './transformYml'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'hello: world',
    },
  }
  const transformed = await transformYml(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `{"hello":"world"}`,
    },
  })
})
