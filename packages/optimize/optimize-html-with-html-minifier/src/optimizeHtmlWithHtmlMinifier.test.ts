import { optimizeWithHtmlNano } from './optimizeHtmlWithHtmlMinifier'

test('basic', async () => {
  const asset = {
    meta: {
      content: `<h1>
  hello world
</h1>`,
    },
  }
  const transformed = await optimizeWithHtmlNano(asset)
  expect(transformed).toEqual({
    meta: {
      content: '<h1>hello world</h1>',
    },
  })
})
