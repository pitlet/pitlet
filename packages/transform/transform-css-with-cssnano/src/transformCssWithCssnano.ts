import * as cssnano from 'cssnano'

export const transformCssWithCssNano = async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const newContent = (
    await cssnano.process(content, {
      from: '',
      to: '',
    })
  ).toString()
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
