import { ICloudFunctionData } from './types'
import { InitHook } from '../init-hook'
import { getAllFunction } from '../../../common/function'

export class FunctionCache {
  private static cache: Map<string, ICloudFunctionData> = new Map()


  static initialize(funcPath) {
    // load function
    const funcs = getAllFunction(funcPath)

    // init cache
    for (const func of funcs) {
      FunctionCache.cache.set(func.name, func)
    }

    // 数据库变化时，清空缓存
    // DatabaseChangeStream.onStreamChange(
    //   CLOUD_FUNCTION_COLLECTION,
    //   FunctionCache.streamChange.bind(this),
    // )
    // logger.info('Function cache initialized.')

    // invoke init function
    InitHook.invoke()
  }

  /**
   * stream the change of cloud function
   * @param change
   * @returns
   */
  // private static async streamChange(
  //   change: ChangeStreamDocument<ICloudFunctionData>,
  // ): Promise<void> {
  //   if (change.operationType === 'insert') {
  //     const func = await DatabaseAgent.db
  //       .collection<ICloudFunctionData>(CLOUD_FUNCTION_COLLECTION)
  //       .findOne({ _id: change.documentKey._id })

  //     // add func in map
  //     FunctionCache.cache.set(func.name, func)
  //   } else if (change.operationType == 'delete') {
  //     FunctionModule.deleteCache()
  //     // remove this func
  //     for (const [funcName, func] of this.cache) {
  //       if (change.documentKey._id.equals(func._id)) {
  //         FunctionCache.cache.delete(funcName)
  //       }
  //     }
  //   }
  // }

  static get(name: string): ICloudFunctionData {
    return FunctionCache.cache.get(name)
  }

  static getAll(): ICloudFunctionData[] {
    return Array.from(FunctionCache.cache.values())
  }
}
