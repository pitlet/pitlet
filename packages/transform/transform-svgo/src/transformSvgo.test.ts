import { createTransformSvgo } from './transformSvgo'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: '<svg></svg>',
    },
  }
  const transformed = await createTransformSvgo({})(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: '<svg/>',
    },
  })
})
