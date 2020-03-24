// const transformFunctionMap = Object.fromEntries(Object.entries(transformFunctionsMap))

import { Transform, TransformFunctionMap } from './types'
import { assertDefined } from './assertions/assertions'

// export const _transform: (
//   transformFunctionMap: TransformFunctionMap,
// ) => Transform = transformFunctionsMap => async asset => {
//   if (!(asset.type in transformFunctionsMap)) {
//     console.log(transformFunctionsMap)
//     throw new Error(
//       `no transform function for "${asset.type}" files. You might need to install a plugin for "${asset.type}" files`,
//     )
//   }
//   let result = asset
//   for (const fn of transformFunctionsMap[asset.type]) {
//     result = await fn(result)
//   }
//   return result
// }

// export const createTransform = ({ transformFunctionMap }) =>
//   _transform(transformFunctionMap)
