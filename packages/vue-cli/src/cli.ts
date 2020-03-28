#!/usr/bin/env node
import program from 'commander'
import { create } from './commands/create/create'
import { build } from './commands/build/build'
import 'source-map-support/register'

program
  .command('create <app-name>')
  .description('create a new project powered by vue-cli-service')
  .action(async name => {
    if (!name) {
      throw new Error('must provide name')
    }
    await create({ name })
  })

program
  .command('build')
  .description('build the project')
  .action(async () => {
    await build()
  })

program.parse(process.argv)
