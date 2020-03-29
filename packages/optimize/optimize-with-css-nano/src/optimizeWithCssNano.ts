import * as postcss from 'postcss'
import * as cssnano from 'cssnano'

export const optimizeWithCssNano = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { css } = await postcss([cssnano]).process(content, {
    from: 'index.css',
  })
  const optimized = {
    meta: {
      content: css,
    },
  }
  return optimized
}
