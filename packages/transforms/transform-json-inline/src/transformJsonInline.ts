// TODO optimize if it's a number or a string (and don't include JSON.parse("42") for 42)

export const transformJsonInline = (api, options) => async asset => {
  const { content, ...otherMeta } = asset.meta
  let parsed: any
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    // api.emitError(error)
    return
  }
  const newContent = `export default JSON.parse(${JSON.stringify(
    JSON.stringify(parsed),
  )})`
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
