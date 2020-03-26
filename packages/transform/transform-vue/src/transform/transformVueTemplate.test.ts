import { transformVueTemplate } from './transformVueTemplate'

test('transform vue template', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `
    <h1>hello world</h1>
    `,
    },
  }
  const transformed = await transformVueTemplate(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js',
      content: `import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("h1", null, "hello world"))
}`,
    },
  })
})
