import { Transform } from '../types'

export const collectAssets: ({
  resolve,
  transform,
  entryAbsolutePath,
  getContent,
}: {
  resolve: any
  transform: Transform
  entryAbsolutePath: string
  getContent: (absolutePath: string) => Promise<string>
}) => Promise<any> = async ({
  resolve,
  transform,
  entryAbsolutePath,
  getContent,
}) => {
  const finalAssets = []
  const seen = new Set<string>()
  const collect = async (absolutePath: string) => {
    if (seen.has(absolutePath)) {
      return
    }
    seen.add(absolutePath)
    const content = await getContent(absolutePath)
    const transformed = await transform({
      absolutePath,
      content,
    })
    if (transformed.childAssets) {
      for (const dependency of transformed.directDependencies) {
        const resolved = await resolve(dependency, absolutePath)
        await collect(resolved)
      }
    } else {
      for (const dependency of transformed.directDependencies) {
        const resolved = await resolve(dependency, absolutePath)
        await collect(resolved)
      }
    }
    // assertDefined(transformed)
    // assertDefined(transformed.dependencies)
    // finalAssets.push(transformed)

    if (transformed.importMapVirtual) {
      for (const assetVirtual of Object.values(transformed.importMapVirtual)) {
        const transformedAssetVirtual = await transform(assetVirtual)
        seen.add(assetVirtual.absolutePath)
        finalAssets.push(transformedAssetVirtual)
      }
    }
    // if (transformed.importMapActual) {
    //   for (const assetActual of Object.values(transformed.importMapActual)) {
    //     const resolvedPath = await resolve(assetActual.importee)
    //     await collect(resolvedPath)
    //   }
    // }
  }
  await collect(entryAbsolutePath)
  return finalAssets
}
;(async () => {
  const files = {
    '/test/index.js': `import { add } from './add.js'`,
    '/test/add.js': 'export const add = (a,b) => a + b',
  }

  const resolve = (importee, importer) => {
    const dirname = importer.slice(0, importer.lastIndexOf('/') + 1)
    if (importee.startsWith('./')) {
      if (!importee.endsWith('.js')) {
        importee += '.js'
      }
      return dirname + importee.slice(2)
    }
    throw new Error('cannot resolve path')
  }

  const getContent = absolutePath => {
    if (absolutePath in files) {
      return files[absolutePath]
    }
    throw new Error(`${absolutePath} not found`)
  }

  const transform = async asset => {
    if (asset.absolutePath === '/test/index.js') {
      return {
        absolutePath: asset.absolutePath,
        directDependencies: ['./add.js'],
        importMapVirtual: {
          './index.vue?type=template': {
            absolutePath: '/test/index.vue?type=template',
            type: 'vue-html',
            content: '<h1>hello world</h1>',
          },
        },
      }
    }
    if (asset.absolutePath === '/test/add.js') {
      return {
        absolutePath: asset.absolutePath,
        directDependencies: [],
      }
    }
    return asset
  }

  const assets = await collectAssets({
    resolve,
    transform,
    entryAbsolutePath: '/test/index.js',
    getContent,
  })

  assets //?
})()
