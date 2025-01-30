#!/usr/bin/env node

import { Command } from 'commander';
import { command as runCommand } from './command/run/'
import { command as applicationCommand } from './command/application/'
import { command as functionCommand } from './command/function/'

const program = new Command();
program.option('-v, --version', 'output version').action((options) => {
    if (!options.version) {
      program.outputHelp()
      return
    }
    const version = require('../package.json').version
    console.log(version)
  })

program.addCommand(applicationCommand())
program.addCommand(functionCommand())
program.addCommand(runCommand())

program.parse(process.argv)
