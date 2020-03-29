import { transform, plugins } from '@swc/core'

export const transformSwc = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { code: transformedCode, map: transformedSourceMap } = await transform(
    content,
    {
      filename: 'index.js',
      plugin: plugins([]),
      module: {
        type: 'commonjs',
      },
    },
  )
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      ...otherMeta,
    },
  }
  return transformed
}
