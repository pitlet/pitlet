#!/usr/bin/env node
import program from 'commander'
import { create } from './commands/create/create'

console.log('hello world')

program
  .option('create <app-name>')
  .description('create a new project powered by vue-cli-service')
  .action(cmd => {
    const name = cmd.create
    if (!name) {
      throw new Error('must provide name')
    }
    create({ name })
  })

program.parse(process.argv)
