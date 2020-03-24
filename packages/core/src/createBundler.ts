import { collectAssets } from './collectAssets/collectAssets'
import * as path from 'path'
import * as fs from 'fs'
import _resolve from 'resolve'

const assertDefined = (value: any) => {
  if (!value) {
    throw new Error('expected value to be defined')
  }
}

export const resolve = async (importee, importer) => {
  return new Promise<string>((resolvePromise, rejectPromise) => {
    _resolve(
      importee,
      { basedir: path.dirname(importer) },
      (error, resolved) => {
        if (error) {
          rejectPromise(error)
        }
        resolvePromise(resolved)
      },
    )
  })
  // if (importee.startsWith('./')) {
  //   const dirname = path.dirname(importer)
  //   return path.join(dirname, 'App.vue')
  //   // return importer.slice()
  // }
  // throw new Error(`cannot resolve module ${importee}`)
}

const getContent = async id => {
  assertDefined(id)
  return fs.readFileSync(id).toString()
}

// export const write = async (outDir, packageOperations) => {}

// export const createTransform = ({ transformFunctionMap, typeMap }) => {
//   return async asset => {
//     const type = asset.type || typeMap[asset.id]
//     if (!(asset.type in transformFunctionMap)) {
//       console.log(transformFunctionMap)
//       throw new Error(
//         `no transform function for "${asset.type}" files. You might need to install a plugin for "${asset.type}" files`,
//       )
//     }
//     const fns = transformFunctionMap[asset.type]
//     let result = asset
//     for (const fn of fns) {
//       result = await fn(result)
//     }
//     return result
//   }
// }

export const nodeBundler = {
  resolve,
  getContent,
}
// export const bundle = ({ entry, outDir }) => {
//   if (fs.existsSync(outDir)) {
//     fs.rmdirSync(outDir)
//   }
// }

// collectAssets(bundler, entryAbsolutePath)

// process.cwd() //?
