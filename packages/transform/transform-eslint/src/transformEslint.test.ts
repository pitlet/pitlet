import { transformEslint } from './transformEslint'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'let x = 1',
    },
  }
  const transformed = await transformEslint(api, options)(asset)
  expect(transformed).toBe(asset)
})
