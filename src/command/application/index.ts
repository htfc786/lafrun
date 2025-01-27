import { Command, program } from 'commander'
import { init } from '../../action/application'

export function command(): Command {
  const cmd = program.command('app')

  cmd
    .command('init [appid]')
    .description('initialize application')
    .option('-b --basic-mode', 'only create .app.yaml, do not init whole project', false)
    // 配置参数
    .option('-n, --name [name]', 'application name', false)
    .option('-d, --description [description]', 'application description', false)
    .action((appid, options) => {
      if (!appid) { appid = '00000' }
      init(appid, options)
    })

  return cmd
}
