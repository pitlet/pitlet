import { transform, Options } from 'sucrase'

const SUCRASE_OPTIONS: Options = {
  transforms: ['imports', 'jsx'],
  filePath: 'index.jsx',
}

export const transformSucrase = async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const { code: transformedCode, sourceMap: transformedSourceMap } = transform(
    content,
    SUCRASE_OPTIONS,
  )
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      sourceMap: transformedSourceMap,
      ...otherMeta,
    },
  }
  return transformed
}
