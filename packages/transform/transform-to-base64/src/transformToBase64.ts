export const transformToBase64 = async asset => {
  const { content, ...otherMeta } = asset.meta
  const newContent = Buffer.from(content).toString('base64')
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
