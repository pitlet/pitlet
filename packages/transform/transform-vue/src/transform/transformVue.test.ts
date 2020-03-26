import { transformVue } from './transformVue'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      id: '/test/src/App.vue',
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
    },
  }
  const transformed = await transformVue(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js',
      id: '/test/src/App.vue',
      content: `import { render } from './index.vue?type=template&lang=html'
import script from './index.vue?type=script&lang=js'


import './index.vue?type=style&index=0&lang=css'
script.render = render

export default script`,
      directDependencies: [
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-html',
            id: `/test/src/App.vue?type=template&lang=html`,
            importee: './index.vue?type=template&lang=html',
            content: `
  <h1>hello world</h1>
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-js',
            id: `/test/src/App.vue?type=script&lang=js`,
            importee: './index.vue?type=script&lang=js',
            content: `
export default {}
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-css',
            id: `/test/src/App.vue?type=style&index=0&lang=css`,
            importee: './index.vue?type=style&index=0&lang=css',
            content: `
h1 {
  font-size: 24px;
}
`,
          },
        },
      ],
    },
  })
})

test('different languages', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      id: '/test/src/App.vue',
      content: `<template lang="pug">
  h1 hello world
</template>
<script lang="ts">
export default {}
</script>
<style lang="scss">
h1 {
  font-size: 24px;
}
</style>`,
    },
  }
  const transformed = await transformVue(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      id: `/test/src/App.vue`,
      type: 'js',
      content: `import { render } from './index.vue?type=template&lang=pug'
import script from './index.vue?type=script&lang=ts'


import './index.vue?type=style&index=0&lang=scss'
script.render = render

export default script`,
      directDependencies: [
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-pug',
            id: '/test/src/App.vue?type=template&lang=pug',
            importee: './index.vue?type=template&lang=pug',
            content: `
  h1 hello world
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-ts',
            id: '/test/src/App.vue?type=script&lang=ts',
            importee: './index.vue?type=script&lang=ts',
            content: `
export default {}
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-scss',
            id: '/test/src/App.vue?type=style&index=0&lang=scss',
            importee: './index.vue?type=style&index=0&lang=scss',
            content: `
h1 {
  font-size: 24px;
}
`,
          },
        },
      ],
    },
  })
})

test('different files', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `<template src="./template.html"></template>
<script src="./script.js"></script>
<style src="./style.css"></style>`,
    },
  }
  const transformed = await transformVue(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js',
      content: `import { render } from './index.vue?type=template&lang=html'
import script from './index.vue?type=script&lang=js'


import './index.vue?type=style&index=0&lang=css'
script.render = render

export default script`,
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            type: 'vue-html',
            importee: './template.html',
          },
        },
        {
          protocol: 'filesystem',
          meta: {
            type: 'vue-js',
            importee: './script.js',
          },
        },
        {
          protocol: 'filesystem',
          meta: {
            type: 'vue-css',
            importee: './style.css',
          },
        },
      ],
    },
  })
})
