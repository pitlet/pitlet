const assertDefined = (value: any) => {
  if (!value) {
    throw new Error('expected value to be defined')
  }
}

const assertTrue = (value: any) => {
  if (value !== true) {
    throw new Error('expected value to be true')
  }
}

const getType = (asset) => {
  if (asset.meta.type) {
    return asset.meta.type
  }
  if (asset.meta.id) {
    if (asset.meta.id.endsWith('.vue')) {
      return 'vue'
    }
    if (asset.meta.id.endsWith('.js')) {
      return 'js'
    }
    if (asset.meta.id.endsWith('.ts')) {
      return 'ts'
    }
    if (asset.meta.id.endsWith('.css')) {
      return 'css'
    }
    if (asset.meta.id.endsWith('.scss')) {
      return 'scss'
    }
    if (asset.meta.id.endsWith('.sass')) {
      return 'sass'
    }
  }
  throw new Error(`unknown type ${JSON.stringify(asset)}`)
}

export const createTransform = ({ transformFunctionMap }) => async (asset) => {
  const type = getType(asset)
  if (!(type in transformFunctionMap)) {
    console.log(type)
    console.log(transformFunctionMap)
    throw new Error(
      `no transform function for "${type}" files. You might need to install a plugin for "${type}" files`
    )
  }
  const fns = transformFunctionMap[type]
  assertTrue(Array.isArray(fns))
  let result = asset
  for (const fn of fns) {
    result = await fn(result)
    assertTrue(typeof result === 'object')
  }
  return result
}
