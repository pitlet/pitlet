import { transformVuePostTransformBlock } from './transformVuePostTransformBlock'

test('postTransformBlock', async () => {
  const asset = {
    meta: {
      content: 'console.log(1 /* ONE */ + 1 /* ONE */);',
      sourceMap: {
        version: 3,
        file: 'index.js',
        sources: ['webpack:///./src/index.ts'],
        sourcesContent: [
          `const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
`,
        ],
        names: [],
        mappings: 'AAEA,OAAO,CAAC,GAAG,CAAC,0BAA0B',
      },
      vueOriginalSource: 'src/App.vue',
      vueOriginalSourceContent: `<template>
  <h1>hello world</h1>
</template>

<script>
const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
</script>`,
      vueBlockOffset: 6,
    },
  }
  const transformed = await transformVuePostTransformBlock(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'console.log(1 /* ONE */ + 1 /* ONE */);',
      sourceMap: {
        version: 3,
        file: 'index.js',
        sources: ['src/App.vue'],
        sourcesContent: [
          `<template>
  <h1>hello world</h1>
</template>

<script>
const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
</script>`,
        ],
        names: [],
        mappings: 'AAQA,OAAO,CAAC,GAAG,CAAC,0BAA0B',
      },
    },
  })
})
