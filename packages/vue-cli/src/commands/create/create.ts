import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

const ROOT = path.join(__dirname, '../../../')
const TEMPLATE = path.join(ROOT, 'template')

export const create = async ({ name }: { name: string }) => {
  console.log('creating project...')
  const cwd = process.cwd()
  const workspaceFolder = path.join(cwd, name)
  if (fs.existsSync(workspaceFolder)) {
    fs.removeSync(workspaceFolder)
  }
  fs.copySync(TEMPLATE, workspaceFolder)
  console.log('installing dependencies...')
  execSync(`cd ${workspaceFolder} && npm i`, {
    stdio: 'ignore',
  })
  console.log('done!')
  try {
    execSync(`code ${workspaceFolder}`)
  } catch (error) {}
}
