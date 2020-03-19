export const createTransform = ({ transformFunctionMap }) => {
  return async asset => {
    if (!(asset.type in transformFunctionMap)) {
      console.log(transformFunctionMap)
      throw new Error(
        `no transform function for "${asset.type}" files. You might need to install a plugin for "${asset.type}" files`,
      )
    }
    const fns = transformFunctionMap[asset.type]
    let result = asset
    for (const fn of fns) {
      result = await fn(result)
    }
    return result
  }
}
