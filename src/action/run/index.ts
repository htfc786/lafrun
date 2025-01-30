import { Local } from '../../runtime/local';
import * as path from 'node:path'
import * as fs from 'node:fs'
import { getBaseDir } from '../../util/sys'
import { FUNCTION_SCHEMA_DIRECTORY, APP_SCHEMA_NAME, FUNCTION_SCHEMA_SUFFIX } from '../../common/constant'
import { lstatSync } from 'fs'
import { exist, loadYamlFile } from '../../util/file'

// run app
export function run(
  funcPath: string,
  options: {
    port: string;
    host: string;
    debug: boolean
  }
) {
  const configFilePath = path.join(getDir(funcPath), APP_SCHEMA_NAME)
  if (!exist(configFilePath)) {
    console.log(`app config:"${APP_SCHEMA_NAME}" file not found`)
    return
  }
  // console.log(funcPath, options)
  // 1. load config
  Local.initConf({})
  // 2. load function
  const nameList = getLocalFuncNames(funcPath)
  const funcList = nameList.map(name => {
    // get func info
    const funcConfigPath = path.join(getDir(funcPath), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_SCHEMA_SUFFIX)
    const funcConf = loadYamlFile(funcConfigPath) 
    // load function code
    const codePath = path.join(getDir(funcPath), FUNCTION_SCHEMA_DIRECTORY, name + '.ts')
    const code = fs.readFileSync(codePath, 'utf-8')
    /// TODO
    return {
      id: "",
      appid: "",
      name: funcConf.name,
      source: {
        code,
        compiled: null,
        uri: null,
        version: null,
        hash: null,
        lang: 'ts',
      },
      desc: funcConf.desc,
      tags: funcConf.tags,
      methods: funcConf.methods,
      createdAt: null,
      updatedAt: null,
      createdBy: "",
    }
  })
  Local.initFunc(funcList)
  // 3. run function
  require('../../runtime')
}

function getDir(pathStr?: string): string {
  if (!pathStr) {
    pathStr = getBaseDir()
  }
  return pathStr
}

function getLocalFuncNames(pathStr?: string): string[] {
  const funcDir = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY)
  const funcs = getLocalFuncName(funcDir, '')
  return funcs
}

function getLocalFuncName(dir: string, prefix: string): string[] {
  const files = fs.readdirSync(dir)
  const funcNames: string[] = []
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = lstatSync(filePath)
    if (stat.isDirectory()) {
      funcNames.push(...getLocalFuncName(filePath, path.join(prefix || '', file)))
    }
    if (stat.isFile() && file.endsWith('.ts')) {
      funcNames.push(
        path
          .join(prefix || '', file)
          .replace(/\\/g, '/')
          .replace(/\.ts$/, ''),
      )
    }
  })
  return funcNames
}
