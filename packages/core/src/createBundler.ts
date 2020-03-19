import { collectAssets } from './collectAssets/collectAssets'
import * as path from 'path'
import * as fs from 'fs'

export const resolve = async (importee, importer) => {
  if (importee.startsWith('./')) {
    return 'App.vue'
    // return importer.slice()
  }
}

// export const write = async (outDir, packageOperations) => {}

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

export const nodeBundler = {
  resolve,
}
// export const bundle = ({ entry, outDir }) => {
//   if (fs.existsSync(outDir)) {
//     fs.rmdirSync(outDir)
//   }
// }

// collectAssets(bundler, entryAbsolutePath)

// process.cwd() //?
