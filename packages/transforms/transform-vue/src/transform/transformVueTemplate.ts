import { compileTemplate } from '@vue/compiler-sfc'

interface Api {}

interface Options {}

export const transformVueTemplate = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { code, errors } = compileTemplate({
    source: content,
    filename: 'index.vue',
  })
  if (errors.length) {
    throw new Error(errors[0].toString())
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
