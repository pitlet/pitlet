import { transformVueStyle } from './transformVueStyle'

test('transform vue style', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `h1 {
  font-size: 24px;
}`,
    },
  }
  const transformed = await transformVueStyle(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'css',
      content: `h1[data-v-123] {
  font-size: 24px;
}`,
    },
  })
})
