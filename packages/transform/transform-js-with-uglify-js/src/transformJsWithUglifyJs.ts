import { minify } from 'uglify-js'

export const transformJsWithUglifyJs = async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const result = minify(content, {
    sourceMap: {
      content: sourceMap,
      filename: 'index.js',
    },
  })
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: result.code,
      sourceMap: JSON.parse(result.map as string),
      ...otherMeta,
    },
  }
  return transformed
}
