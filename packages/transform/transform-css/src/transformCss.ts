export const transformCss = async asset => {
  const transformed = {
    protocol: 'virtual',
    meta: {
      directDependencies: [],
      resolvedDirectDependencies: [],
      ...asset.meta,
    },
  }
  return transformed
}
