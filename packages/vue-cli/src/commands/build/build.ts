import * as fs from 'fs-extra'
import * as path from 'path'

const cwd = process.cwd()
const outDir = path.join(cwd, 'dist')

if (fs.existsSync(outDir)) {
  fs.removeSync(outDir)
}

;(async () => {
  await new Promise(r => setTimeout(r, 100))
  await nodeBundle({
    entry,
    outDir,
    transformFunctionMap,
  })
})()
