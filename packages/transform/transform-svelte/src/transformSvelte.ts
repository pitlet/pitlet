import { compile } from 'svelte/compiler'

export const transformSvelte = (api, options) => async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const { js, css } = compile(content, {
    // dev: true,
  })
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: js.code,
      sourceMap: js.map,
      ...otherMeta,
    },
  }
  return transformed
}

transformSvelte(
  {},
  {},
)({
  meta: {
    content: `<h1>hello world</h1>

<style>
h1{
  font-size: 24px;
}
</style>`,
  },
}) //?
