import { transformVueStyle } from './transformVueStyle'

test('transform vue style', async () => {
  const api = {}
  const options = {}
  const asset = {
    id: '/test/index.vue?type=style&index=0&lang=css',
    content: `
h1 {
  font-size: 24px;
}
`,
  }
  const transformed = await transformVueStyle(api, options)(asset)
  expect(transformed).toEqual({
    id: '/test/index.vue?type=style&index=0&lang=css',
    content: `
h1[data-v-123] {
  font-size: 24px;
}
`,
  })
})
