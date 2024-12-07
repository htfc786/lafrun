import Config from './config'
import { ALL_METHODS } from './constants';
import { compileTs2js } from './support/lang';

export class Local {
  
  /**
   * 读取本地配置文件
   */
  static loudConf() {
    // 打开本地json文件
    try {
      const confJson = require(`${Config.PATH}/app.json`);

      // 处理dependencies
      //{"name":"aws-sdk","version":"latest"}
      let dependencies = confJson.dependencies || [];
      dependencies = dependencies.map(dependency => `${dependency.name}: ${dependency.version || 'latest'}`);
      
      return {
        environments: confJson.environments || [],
        dependencies: dependencies,
      }
    } catch (error) {
      throw new Error('Failed to load local configuration');
    }
  }

  static loudCloudFunctions() {
    try {
      // 获取文件夹列表
      const fs = require('fs');
      const dirs = fs.readdirSync(`${Config.PATH}/functions`);
      // 读取每一个文件夹下的meta.json
      const result = [];
      for (const dir of dirs) {
        const metaPath = `${Config.PATH}/functions/${dir}/meta.json`;
        const meta = require(metaPath);
        // 读取文件创建信息
        const stat = fs.statSync(metaPath);
        const createdAt = new Date(stat.ctime);
        const updatedAt = new Date(stat.mtime);
        // 解析文件内容
        const name = meta.name || dir;
        const desc = meta.desc || '';
        const tags = meta.tags || [];
        const version = meta.version || 1;
        const methods = meta.methods || ALL_METHODS;
        // 读取代码
        const code = fs.readFileSync(`${Config.PATH}/functions/${dir}/index.ts`, 'utf8');

        result.push({
          id: name,
          appid: Config.APPID,
          name,
          source: {
            code,
            compiled: compileTs2js(code, name),
            uri: null,
            version,
            hash: null,
            lang: 'ts',
          },
          desc,
          tags,
          methods,
          createdAt,
          updatedAt,
          createdBy: "",
        })
      }
      
      return result;
    } catch (error) {
      throw new Error('Failed to load local cloud functions');
    }
  }

}