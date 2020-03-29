import { compile } from '@riotjs/compiler'

export const transformRiot = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { code: transformedCode, map: transformedSourceMap } = compile(
    content,
    {
      file: 'index.riot',
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
