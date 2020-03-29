import { minify } from 'html-minifier'

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
}

export const optimizeWithHtmlNano = async asset => {
  const { content, ...otherMeta } = asset.meta
  const transformedCode = minify(content, htmlMinifierOptions)
  const optimized = {
    meta: {
      content: transformedCode,
      ...otherMeta,
    },
  }
  return optimized
}
