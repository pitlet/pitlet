import { transformCss } from './transformCss'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'h1 {font-size: 24px}',
    },
  }
  const transformed = await transformCss(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'h1 {font-size: 24px}',
      directDependencies: [],
      resolvedDirectDependencies: [],
    },
  })
})
