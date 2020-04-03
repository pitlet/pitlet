import * as yaml from 'js-yaml'

export const transformYmlToJson = async asset => {
  const { content, ...otherMeta } = asset.meta
  let parsed: any
  try {
    parsed = yaml.safeLoad(content)
  } catch (error) {
    // api.emitError(error)
    return
  }
  const newContent = JSON.stringify(parsed)
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
