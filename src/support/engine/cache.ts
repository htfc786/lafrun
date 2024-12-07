import { ICloudFunctionData } from './types'
import { logger } from '../logger'
import { DatabaseAgent } from '../../db'
import { CLOUD_FUNCTION_COLLECTION } from '../../constants'
import { InitHook } from '../init-hook'
// import { DatabaseChangeStream } from '../database-change-stream'
import { FunctionModule } from './module'
import { ChangeStreamDocument } from 'mongodb'
import { Local } from '../../local'

export class FunctionCache {
  private static cache: Map<string, ICloudFunctionData> = new Map()


  static async initialize(): Promise<void> {
    logger.info('initialize function cache')
    // TODO 从本地读取
    // const funcs = await DatabaseAgent.db
    //   .collection<ICloudFunctionData>(CLOUD_FUNCTION_COLLECTION)
    //   .find()
    //   .toArray()
    const funcs = Local.loudCloudFunctions()

    for (const func of funcs) {
      FunctionCache.cache.set(func.name, func)
    }

    // 数据库变化时，清空缓存
    // DatabaseChangeStream.onStreamChange(
    //   CLOUD_FUNCTION_COLLECTION,
    //   FunctionCache.streamChange.bind(this),
    // )
    // logger.info('Function cache initialized.')

    // 手塞函数
    FunctionCache.cache.set("hello",{
      id: "",
      appid: "000000",
      name: "",
      source: {
        code: `exports.main = function () {
  return "hello world!";
};`,
        compiled: null,
        uri: null,
        version: 1,
        hash: null,
        lang: null,
      },
      desc: "",
      tags: [],
      methods: ["GET"],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "htfc786",
    })
    console.log(FunctionCache.cache)

    // invoke init function
    InitHook.invoke()
  }

  /**
   * stream the change of cloud function
   * @param change
   * @returns
   */
  private static async streamChange(
    change: ChangeStreamDocument<ICloudFunctionData>,
  ): Promise<void> {
    if (change.operationType === 'insert') {
      const func = await DatabaseAgent.db
        .collection<ICloudFunctionData>(CLOUD_FUNCTION_COLLECTION)
        .findOne({ _id: change.documentKey._id })

      // add func in map
      FunctionCache.cache.set(func.name, func)
    } else if (change.operationType == 'delete') {
      FunctionModule.deleteCache()
      // remove this func
      for (const [funcName, func] of this.cache) {
        if (change.documentKey._id.equals(func._id)) {
          FunctionCache.cache.delete(funcName)
        }
      }
    }
  }

  static get(name: string): ICloudFunctionData {
    return FunctionCache.cache.get(name)
  }

  static getAll(): ICloudFunctionData[] {
    return Array.from(FunctionCache.cache.values())
  }
}
