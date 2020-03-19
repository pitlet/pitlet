import { transformStylelint } from './transformStylelint'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `h1 {font-size: 24px}`,
    },
  }
  const transformed = await transformStylelint(api, options)(asset)
  expect(transformed).toBe(asset)
  // expect(mockEmitError).toHaveBeenCalledTimes(0)
})
