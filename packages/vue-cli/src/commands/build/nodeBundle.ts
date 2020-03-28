import { collectAssets, createTransform } from '../../../../core/dist'
import { nodeBundler } from '../../../../core/dist'
import { packageJs } from '../../../../package/package-js/dist/packageJs'
import * as fs from 'fs'
import * as path from 'path'

export const nodeBundle = async ({
  workspaceFolder,
  transformFunctionMap,
}: {
  workspaceFolder: string
  transformFunctionMap: any
}) => {
  const entry = path.join(workspaceFolder, 'src', 'main.js')
  const outDir = path.join(workspaceFolder, 'dist')
  const assets = await collectAssets({
    bundler: nodeBundler,
    entry: {
      protocol: 'filesystem',
      meta: {
        id: entry,
      },
    },
    transform: createTransform({ transformFunctionMap }),
  })
  const packaged = await packageJs(assets, '', entry)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }
  for (const operation of packaged) {
    switch (operation.type) {
      case 'write':
        fs.writeFileSync(
          path.join(outDir, operation.destinationPath),
          operation.content,
        )
        break
      default:
        console.log('not supported')
    }
  }
  const indexHtml = fs
    .readFileSync(path.join(workspaceFolder, 'public', 'index.html'))
    .toString()
  const withScript = indexHtml.replace(
    /<\/body>/,
    `  <script type="module" src="./runtime.js"></script>\n</body>`,
  )
  fs.writeFileSync(path.join(outDir, 'index.html'), withScript)
}
