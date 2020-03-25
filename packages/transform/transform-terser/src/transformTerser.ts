import { minify } from 'terser'

export const transformTerser = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const newContent = minify(content).code
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
