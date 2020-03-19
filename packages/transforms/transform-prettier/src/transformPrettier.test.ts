import { transformPrettier } from './transformPrettier'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'const add=(a,b)=>a+b',
    },
  }
  const transformed = await transformPrettier(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'const add = (a, b) => a + b;\n',
    },
  })
})
