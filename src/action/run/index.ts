import * as path from 'node:path'
import { APP_SCHEMA_NAME } from '../../common/constant'
import { exist } from '../../util/file'
import { getDir } from '../../common/config'
import { initialize as configInitialize } from '../../common/config'

// run app
export function run(
  funcPath: string,
  options: {
    port: string;
    debug: boolean;
    db: string;
    secret: string;
  }
) {
  // print project name
  console.log(`lafrun v${require('../../../package.json').version}`)
  // check config file
  const configFilePath = path.join(getDir(funcPath), APP_SCHEMA_NAME)
  if (!exist(configFilePath)) {
    console.log(`app config:"${APP_SCHEMA_NAME}" file not found`)
    return
  }
  // console.log(funcPath, options)
  // init conf
  configInitialize(funcPath, options)
  // run function
  const runtime = require('../../runtime')
  runtime.run(funcPath)
}
