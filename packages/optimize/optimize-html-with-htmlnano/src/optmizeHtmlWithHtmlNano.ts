import posthtml from 'posthtml'
import htmlNano from 'htmlnano'

const htmlNanoOptions = {
  minifyJs: false,
}

export const optimizeWithHtmlNano = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { html } = await posthtml([htmlNano(htmlNanoOptions)]).process(content)
  const optimized = {
    meta: {
      content: css,
    },
  }
  return optimized
}
