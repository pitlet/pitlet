import { transformVue } from './transformVue'

test('transform vue', async () => {
  const api = {
    getFileName: () => 'index.vue',
  }
  const options = {}
  const asset = {
    id: '/test/index.vue',
    content: `<template>
<h1>hello world</h1>
</template>

<script>
export default {}
</script>

<style>
h1 {
  font-size: 24px;
}
</style>`,
  }
  const transformed = await transformVue(api, options)(asset)
  expect(transformed).toEqual({
    id: `/test/index.vue`,
    content: `import { render } from './index.vue?type=template&lang=html'
import script from './index.vue?type=script&lang=js'


import './index.vue?type=style&index=0&lang=css'
script.render = render

export default script`,
    importMapActual: {},
    importMapVirtual: {
      './index.vue?type=template&lang=html': {
        type: 'vue-html',
        id: '/test/index.vue?type=template&lang=html',
        content: `
<h1>hello world</h1>
`,
      },
      './index.vue?type=script&lang=js': {
        type: 'vue-js',
        id: '/test/index.vue?type=script&lang=js',
        content: `
export default {}
`,
      },
      './index.vue?type=style&index=0&lang=css': {
        type: 'vue-css',
        id: '/test/index.vue?type=style&index=0&lang=css',
        content: `
h1 {
  font-size: 24px;
}
`,
      },
    },
  })
})
