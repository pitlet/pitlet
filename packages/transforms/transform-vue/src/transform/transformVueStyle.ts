import { compileStyleAsync } from '@vue/compiler-sfc'

// interface Api {}

// interface Options {}

export const transformVueStyle = async asset => {
  const { content, vueSourceMap, ...otherMeta } = asset.meta
  const { code, map, errors } = await compileStyleAsync({
    source: content,
    filename: 'index.vue',
    id: 'data-v-123',
    scoped: true,
    // preprocessLang: 'sass',
  })
  if (errors.length) {
    throw errors[0]
  }
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: code,
      ...otherMeta,
    },
  }
  return transformed
}
