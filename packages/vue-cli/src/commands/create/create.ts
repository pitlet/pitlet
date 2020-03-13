import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs-extra'

const ROOT = path.join(__dirname, '../../../')
const TEMPLATE = path.join(ROOT, 'template')

export const create = ({ name }: { name: string }) => {
  const cwd = process.cwd()
  const workspaceFolder = path.join(cwd, name)

  if (fs.existsSync(workspaceFolder)) {
    fs.removeSync(workspaceFolder)
  }
  fs.copySync(TEMPLATE, workspaceFolder)
  execSync(`cd ${workspaceFolder} && npm install`, {
    stdio: 'ignore',
  })
  console.log('created')
}
