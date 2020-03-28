// const originalResolve = nodeBundler.resolve

// nodeBundler.resolve = async (importee, importer) => {
//   if (importee === 'vue') {
//     return alias.vue
//   }
//   return originalResolve(importee, importer)
// }
// ;(async () => {
//   console.log(
//     process.memoryUsage().heapUsed / (1024 * 1024) + 'MB memory usage',
//   )
//   measureStart('collect assets')
//   const assets = await collectAssets({
//     bundler: nodeBundler,
//     transform: createTransform({ transformFunctionMap }),
//     entry,
//   })
//   measureEnd('collect assets')
//   console.log(
//     process.memoryUsage().heapUsed / (1024 * 1024) + 'MB memory usage',
//   )
//   // console.log(JSON.stringify(assets, null, 2))
//   measureStart('package')
//   const packaged = await packageJs(assets, '', entry.meta.id)
//   measureEnd('package')
//   measureStart('dist')
//   if (!fs.existsSync(path.join(__dirname, 'dist'))) {
//     fs.mkdirSync(path.join(__dirname, 'dist'))
//   }
//   measureEnd('dist')
//   measureStart('write')
//   for (const operation of packaged) {
//     switch (operation.type) {
//       case 'write':
//         fs.writeFileSync(
//           path.join(__dirname, 'dist', operation.destinationPath),
//           operation.content,
//         )
//         break
//       default:
//         console.log('not supported')
//     }
//   }
// })()
