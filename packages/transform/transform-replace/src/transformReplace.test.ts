import { transformReplace } from './transformReplace'

test('basic', async () => {
  const api = {}
  const options = {
    replacements: { 'process.env.NODE_ENV': '"development"' },
  }
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'const env = process.env.NODE_ENV',
    },
  }
  const transformed = await transformReplace(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'const env = "development"',
    },
  })
})
