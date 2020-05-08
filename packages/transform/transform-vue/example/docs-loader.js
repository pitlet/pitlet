export const transformDocs = async (asset) => {
  const { content, type, vueSourceMap, ...otherMeta } = asset.meta
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: `export default function (Comp) {
        Comp.mounted = () => console.log(${JSON.stringify(content.trim())})`,
      ...otherMeta,
    },
  }
  return transformed
}
