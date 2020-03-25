import * as prettier from 'prettier'

export const transformPrettier = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const newContent = prettier.format(content, { filepath: 'index.js' })
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
