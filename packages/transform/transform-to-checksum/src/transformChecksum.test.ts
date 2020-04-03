import { transformChecksum } from './transformChecksum'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'hello world',
    },
  }
  const transformed = await transformChecksum(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js',
      content: 'export default "5eb63bbbe01eeed093cb22bb8f5acdc3"',
    },
  })
})
