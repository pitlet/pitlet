import { compile } from 'imba/lib/compiler'

const imbaOptions = {
  ENV_WEBPACK: true,
  comments: false,
  target: 'web',
  sourceMap: true,
  sourcePath: 'index.imba',
}

export const transformJsonToJs = async asset => {
  const { content, ...otherMeta } = asset.meta
  const transformedCode = compile(content, imbaOptions).toString()
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      ...otherMeta,
    },
  }
  return transformed
}
