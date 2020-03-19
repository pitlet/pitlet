import * as stylus from 'stylus'

export const transformStylus = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const style = stylus(content, {
    filename: 'index.styl',
  })
  const { css, error } = await new Promise<{ error: Error; css: string }>(
    resolve => {
      style.render((error, css) => resolve({ error, css }))
    },
  )
  if (error) {
    // api.emitError(error)
    return
  }
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: css,
      ...otherMeta,
    },
  }
  return transformed
}
