import { transformVueTemplate } from './transformVueTemplate'

test('transform vue template', async () => {
  const api = {}
  const options = {}
  const asset = {
    id: '/test/index.vue?type=template&lang=html',
    content: `
<h1>hello world</h1>
`,
  }
  const transformed = await transformVueTemplate(api, options)(asset)
  expect(transformed).toEqual({
    id: `/test/index.vue?type=template&lang=html`,
    content: `import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("h1", null, "hello world"))
}`,
  })
})
