import { transformVue } from './transformVue'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
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
            content: `
  <h1>hello world</h1>
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-js',
            content: `
export default {}
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-css',
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
            content: `
  h1 hello world
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-ts',
            content: `
export default {}
`,
          },
        },
        {
          protocol: 'virtual',
          meta: {
            type: 'vue-scss',
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
