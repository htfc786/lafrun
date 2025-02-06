import * as path from 'path'
import { APP_SCHEMA_NAME } from '../common/constant'
import { getAppPath } from '../util/sys'
import { exist, loadYamlFile, writeYamlFile } from '../util/file'

export class AppSchema {
  name: string
  appid: string
  invokeUrl?: string
  function?: {
    developToken?: string
    developTokenExpire?: number
  }
  storage?: {
    endpoint: string
    accessKeyId: string
    accessKeySecret: string
    sessionToken?: string
    expire: number
  }
  // add
  database?: {
    uri?: string
    database?: string
    username?: string
    password?: string
    host?: string
    port?: number
  }
  logConfig?: {
    level?: string
    displayLineLevel?: string
    depth?: number
    server?: {
      url?: string
      token?: string
    }
  }
  server?: {
    port?: number
    secret?: string
    request?: {
      limitSize?: string
    }
    config?: {
      disableModuleCache?: boolean
    }
  }
  develop?: {
    disable?: boolean
    changeInterval?: number
  }
  dependency?: {
    npmInstallFllags?: string
    baseDir?: string
  }
  environments?: object

  static read(): AppSchema {
    const configPath = path.join(getAppPath(), APP_SCHEMA_NAME)
    return loadYamlFile(configPath)
  }

  static write(schema: AppSchema): void {
    const configPath = path.join(getAppPath(), APP_SCHEMA_NAME)
    return writeYamlFile(configPath, schema)
  }

  static exist(): boolean {
    const configPath = path.join(getAppPath(), APP_SCHEMA_NAME)
    return exist(configPath)
  }
}