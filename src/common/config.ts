
import * as path from 'node:path'
import { dependenciesHotReload } from '../runtime/support/module-hot-reload'
import { getAppPath } from '../util/sys'
import { APP_SCHEMA_NAME, PROJECT_SCHEMA_NAME } from '../common/constant'
import { loadYamlFile } from '../util/file'

export function getDir(pathStr?: string): string {
  if (!pathStr) {
    pathStr = getAppPath()
  }
  return pathStr
}

function getDbUri(db) {
  if (db.uri) {
    return db.uri
  } else if (db.username && db.password && db.host && db.port) {
    return `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.database || ''}`
  }
}

export function initialize(funcPath?: string, options?: any) {
  // load config
  // read config file
  const appConfPath = path.join(getDir(funcPath), APP_SCHEMA_NAME)
  const appConf = loadYamlFile(appConfPath)

  const appProjectPath = path.join(getDir(funcPath), PROJECT_SCHEMA_NAME)
  const appProject = loadYamlFile(appProjectPath)
  // merge config
  // dburi
  const dbUri = getDbUri(appConf?.database || {})
  // environments
  const envs = appConf?.environments || {}
  // dependencies
  const dependencies = appProject.spec?.dependencies || {}

  // conf obj
  const conf = {
    DB_URI: options.db ?? dbUri,
    SERVER_SECRET: options.secret ?? appConf?.server?.secret,
    LOG_LEVEL: options.secret ?? appConf?.logConfig?.level,
    DISPLAY_LINE_LOG_LEVEL: appConf?.logConfig?.displayLineLevel,
    LOG_DEPTH: appConf?.logConfig?.depth,
    __PORT: options.port ?? appConf.server?.port,
    NODE_ENV: options.debug ? 'development' : 'production',
    RUNTIME_IMAGE: appProject?.spec?.runtime,
    APPID: appConf?.appId,
    NPM_INSTALL_FLAGS: appConf?.dependency?.npmInstallFllags,
    REQUEST_LIMIT_SIZE: appConf?.server?.request?.limitSize,
    LOG_SERVER_URL: appConf?.logConfig?.server?.url,
    LOG_SERVER_TOKEN: appConf?.logConfig?.server?.token,
    CHANGE_STREAM_RECONNECT_INTERVAL: appConf?.develop?.changeInterval,
    OSS_INTERNAL_ENDPOINT: appConf?.storage?.endpoint,
    OSS_EXTERNAL_ENDPOINT: appConf?.storage?.endpoint,
    DISABLE_MODULE_CACHE: String(appConf?.server?.config?.disableModuleCache),
    CUSTOM_DEPENDENCY_BASE_PATH: appConf?.dependency?.baseDir,
    ...envs,
  }

  updateConfig(conf, dependencies, true)

  // DatabaseChangeStream.onStreamChange(CONFIG_COLLECTION, () =>
  //   this.updateConfig(false),
  // )
}

export async function updateConfig(conf, dependencies, init = false) {
  if (!conf) {
    return
  }

  // update process.env
  process.env = { ...process.env, ...conf } 

  dependenciesHotReload(dependencies, init)

}