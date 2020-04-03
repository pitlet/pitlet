import * as crypto from 'crypto'

export const transformChecksum = async asset => {
  const { content, type, ...otherMeta } = asset.meta
  const hash = crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
  const newContent = `export default "${hash}"`
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      type: 'js',
      ...otherMeta,
    },
  }
  return transformed
}
