import * as Svgo from 'svgo'

export interface TransformSvgoOptions {}

export const createTransformSvgo = (
  options: TransformSvgoOptions,
) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const newContent = (await new Svgo(options).optimize(content)).data
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
