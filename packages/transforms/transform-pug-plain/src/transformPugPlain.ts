import * as pug from 'pug'

const compilationOptions = {
  filename: 'index.pug',
  doctype: 'html',
}

export const transformPugPlain = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const template = pug.compile(content, compilationOptions)
  const newContent = template({})
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
