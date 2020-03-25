import * as less from 'less'

export const transformLess = (api, options) => async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const { error, output } = await new Promise(resolve => {
    less.render(content, (error, output) => resolve({ error, output }))
  })
  if (sourceMap) {
    console.warn('input sourcemap is not supported for less') // TODO what happens when vue automatically fixes this
  }
  if (error) {
    // api.emitError(error)
    return
  }
  const { css, map, imports } = output
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: css,
      ...otherMeta,
    },
  }
  return transformed
}
