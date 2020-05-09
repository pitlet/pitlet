const assertDefined = (value: any) => {
  if (!value) {
    console.log(JSON.stringify(value))
    throw new Error('expected value to be defined')
  }
}

interface Asset {
  readonly protocol: string
  readonly meta: {
    readonly directDependencies?: readonly Asset[]
    readonly resolvedDirectDependencies?: readonly Asset[]
    readonly id?: any
    readonly sourceMap?: any
    readonly [key: string]: any
  }
}

interface AssetFileSystem extends Asset {
  readonly protocol: 'filesystem'
}

interface AssetVirtual extends Asset {
  readonly protocol: 'virtual'
  readonly meta: {
    readonly content: string
  }
}

export const collectAssets: ({
  bundler,
  transform,
  entry,
}: {
  bundler: {
    resolve: (importee: string, importer: string) => Promise<string>
    getContent: (id: string) => Promise<string>
  }
  transform: (asset: Asset) => Promise<Asset>
  entry
}) => Promise<any> = async ({ bundler, transform, entry }) => {
  const finalAssets = []
  const seen = new Set<string>()
  const collect = async (asset: any) => {
    let virtualAsset
    if (asset.protocol === 'filesystem') {
      virtualAsset = {
        protocol: 'virtual',
        meta: {
          content: await bundler.getContent(asset.meta.id),
          ...asset.meta,
        },
      }
    } else if (asset.protocol === 'virtual') {
      virtualAsset = asset
    } else {
      throw new Error('invalid protocol')
    }
    // const asset = {
    //   protocol: 'filesystem',
    //   meta: {
    //     id,
    //   },
    // }

    const transformed = await transform(virtualAsset)
    assertDefined(transformed)
    assertDefined(transformed.meta)
    if (transformed.meta.directDependencies) {
      const resolvedDirectDependencies = await Promise.all(
        transformed.meta.directDependencies.map(async (directDependency) => {
          switch (directDependency.protocol) {
            case 'filesystem':
              const { importee, ...otherMeta } = directDependency.meta
              const resolved = await bundler.resolve(importee, asset.meta.id)
              return {
                protocol: 'filesystem',
                meta: {
                  id: resolved,
                  ...otherMeta,
                },
              }
            case 'virtual':
              return directDependency
            default:
              throw new Error(
                `invalid protocol ${JSON.stringify(directDependency)}`
              )
          }
        })
      )
      for (const resolvedDirectDependency of resolvedDirectDependencies) {
        assertDefined(resolvedDirectDependency)
        assertDefined(resolvedDirectDependency.meta)
        assertDefined(resolvedDirectDependency.meta.id)
        if (!seen.has(resolvedDirectDependency.meta.id)) {
          seen.add(resolvedDirectDependency.meta.id)
          await collect(resolvedDirectDependency)
        }
      }
      // TODO those lines are probably the most inefficient, decreasing performance by 20%
      const finalAsset = {
        ...transformed,
        meta: {
          ...transformed.meta,
          resolvedDirectDependencies,
        },
      }
      finalAssets.push(finalAsset)
    } else {
      finalAssets.push(transformed)
    }
  }
  await collect(entry)
  return finalAssets
}
// ;(async () => {
//   const files = {
//     '/test/index.js': `import { add } from './add.js'`,
//     '/test/add.js': 'export const add = (a,b) => a + b',
//   }

//   const resolve = (importee, importer) => {
//     const dirname = importer.slice(0, importer.lastIndexOf('/') + 1)
//     if (importee.startsWith('./')) {
//       if (!importee.endsWith('.js')) {
//         importee += '.js'
//       }
//       return dirname + importee.slice(2)
//     }
//     if (importee === '/test/add.js') {
//       return importee
//     }
//     throw new Error('cannot resolve path')
//   }

//   const getContent = absolutePath => {
//     if (absolutePath in files) {
//       return files[absolutePath]
//     }
//     throw new Error(`${absolutePath} not found`)
//   }

//   const transform = async asset => {
//     if (asset.meta.id === '/test/index.js') {
//       return {
//         protocol: 'virtual',
//         meta: {
//           ...asset.meta,
//           directDependencies: ['./add.js'],
//           importMapVirtual: {
//             './index.vue?type=template': {
//               absolutePath: '/test/index.vue?type=template',
//               type: 'vue-html',
//               content: '<h1>hello world</h1>',
//             },
//           },
//         },
//       }
//     }
//     if (asset.meta.id === '/test/add.js') {
//       return {
//         protocol: 'virtual',
//         meta: {
//           id: asset.meta.id,
//           directDependencies: [],
//         },
//       }
//     }
//     return asset
//   }
//   const getId = (dependency, asset) => {
//     asset //?
//   }
//   // for (let i = 0; i < 100; i++) {
//   const assets = await collectAssets({
//     bundler: {
//       resolve,
//     },
//     transform,
//     entry: `/test/index.js`,
//   }) //?.
//   // }

//   assets //?
// })()
