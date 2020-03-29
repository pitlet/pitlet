import { optimizeWithCssNano } from './optimizeWithCssNano'

test('basic', async () => {
  const asset = {
    meta: {
      content: 'h1 {font-size: 24px}',
    },
  }
  const transformed = await optimizeWithCssNano(asset)
  expect(transformed).toEqual({
    meta: {
      content: 'h1{font-size:24px}',
    },
  })
})
