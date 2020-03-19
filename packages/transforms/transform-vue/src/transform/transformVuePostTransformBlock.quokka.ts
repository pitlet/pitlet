import { transformVueScript } from './transformVueScript'

const r = transformVueScript(
  {},
  {},
)({
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
    vueOriginalSource: 'App.vue',
    vueOriginalSourceContent: `<template>
  <h1>hello world</h1>
</template>

<script>
const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
</script>`,
    vueBlockOffset: 4,
  },
}) //?

r.then(x => {
  console.log(JSON.stringify(x, null, 2))
})
