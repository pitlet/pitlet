import { transformToBase64 } from './transformToBase64'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'hello world',
    },
  }
  const transformed = await transformToBase64(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js',
      content: 'aGVsbG8gd29ybGQ=',
    },
  })
})
