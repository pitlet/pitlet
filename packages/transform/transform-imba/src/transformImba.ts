import { compile, Options } from 'imba/lib/compiler'

const imbaOptions: Options = {
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
