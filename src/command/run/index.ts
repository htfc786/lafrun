import { Command, program } from 'commander'
import { run } from '../../action/run'

export function command(): Command {
  const cmd = program
    .command('run [path]')
    .description('run app')
    .option('-p, --port [port]', 'port', '8000')
    .option('-d, --debug', 'debug mode', false)
    .option('--db [dburi]', 'mongoDB uri', null)
    .option('--secret [secret]', 'server secret', null)
    .action((path, options) => {
      run(path, options)
    })

  return cmd
}
