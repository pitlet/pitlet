import * as marked from 'marked'

export const transformMarkdown = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  marked.setOptions({})
  const newContent = marked(content)
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
