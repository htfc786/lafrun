import * as path from 'node:path'
import * as fs from 'node:fs'
import { FUNCTION_SCHEMA_DIRECTORY, FUNCTION_SCHEMA_SUFFIX, FUNCTION_CODE_SUFFIX } from '../common/constant'
import { getBaseDir } from '../util/sys'
import { lstatSync } from 'fs'
import { exist, remove, loadYamlFile } from '../util/file'
import { ICloudFunctionData } from '../types'

export function getDir(pathStr?: string): string {
  if (!pathStr) {
    pathStr = getBaseDir()
  }
  return pathStr
}

/**
 * 获取本地函数名称
 * @param dir 函数目录
 * @param prefix 前缀
 * @returns  函数名称
 */
export function getLocalFuncName(dir: string, prefix: string): string[] {
  const files = fs.readdirSync(dir)
  const funcNames: string[] = []
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = lstatSync(filePath)
    if (stat.isDirectory()) {
      funcNames.push(...getLocalFuncName(filePath, path.join(prefix || '', file)))
    }
    if (stat.isFile() && file.endsWith(FUNCTION_CODE_SUFFIX)) {
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

/**
 * 获取本地函数名称
 * @param pathStr 路径
 * @returns  函数名称
 */
export function getLocalFuncNames(pathStr?: string): string[] {
  const funcDir = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY)
  const funcs = getLocalFuncName(funcDir, '')
  return funcs
}

/**
 * 删除本地函数
 * @param name 函数名称
 * @param pathStr 路径
 * @returns  函数名称
 */
export function removeFunction(name: string, pathStr?: string) {
  if (existFunction(name, pathStr)) {
    const funcConfigPath = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_SCHEMA_SUFFIX)
    remove(funcConfigPath)
  }
  const funcPath = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_CODE_SUFFIX)
  if (exist(funcPath)) {
    remove(funcPath)
  }
}

/**
 * 是否存在函数
 * @param name 函数名称
 * @param pathStr 路径
 * @returns  是否存在
 */
export function existFunction(name: string, pathStr?: string) {
    const funcConfigPath = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_SCHEMA_SUFFIX)
    return exist(funcConfigPath)
}

/**
 * 获取函数信息
 * @param name 函数名称
 * @param pathStr 路径
 * @returns  函数信息
 */
export function getFunction(name: string, pathStr?: string): ICloudFunctionData {
  // get func info
  const funcConfigPath = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_SCHEMA_SUFFIX)
  const funcConf = loadYamlFile(funcConfigPath) 
  // load function code
  const codePath = path.join(getDir(pathStr), FUNCTION_SCHEMA_DIRECTORY, name + FUNCTION_CODE_SUFFIX)
  const code = fs.readFileSync(codePath, 'utf-8')
  // func obj
  return {
    name: funcConf.name,
    source: { code, compiled: null },
    desc: funcConf.desc,
    tags: funcConf.tags,
    methods: funcConf.methods
  }
}

/**
 * 获取全部函数信息
 * @param pathStr 路径
 * @returns  函数信息
 */
export function getAllFunction(pathStr?: string): ICloudFunctionData[] {
  const nameList = getLocalFuncNames(pathStr)
  return nameList.map(name => getFunction(name, pathStr))
}
