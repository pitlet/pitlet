import { transformCssWithCssNano } from './transformCssWithCssnano'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `h1 {font-size: 24px}`,
    },
  }
  const transformed = await transformCssWithCssNano(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'h1{font-size:24px}',
    },
  })
})
