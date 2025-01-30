import { Command, program } from 'commander'
import { run } from '../../action/run'

export function command(): Command {
  const cmd = program
    .command('run [path]')
    .description('run app')
    .option('-p, --port [port]', 'port', '3000')
    .option('-h, --host [host]', 'host', 'localhost')
    .option('-d, --debug', 'debug mode', false)
    .action((path, options) => {
      // if (!path) { 
      //   console.log('Please provide a path!')
      //   return
      // }
      run(path, options)
    })

  return cmd
}
