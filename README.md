# lafrun
一个可以在本地运行的laf运行时

## 使用
### 安装
```bash
npm install -g lafrun
```

### 运行项目
```bash
lafrun run [path]
```
path: (可选)项目路径

### 创建项目
```bash
lafrun app init
```

### 函数操作
- 创建函数
```bash
lafrun func create <name>
```
name：函数名称，如包含`/`，在访问url上也会带上`/`

- 删除函数
```bash
lafrun func del <name>
```
name：函数名称

- 查看函数列表
```bash
lafrun func list
```

## 依赖
cli: `commander`、`typescript`、`yaml`、`dayjs`、`node-emoji`、`prompts`、`cli-table3`、`@types/node`(--save-dev)
runtime: `express``cors``express-xml-bodyparser``dotenv``url``mongodb``database-proxy``ws``jsonwebtoken``pako``multer``node-modules-utils``chalk``lodash``source-map-support``@lafjs/cloud``openapi3-ts/oas30`

## 引用
- `runtime\handler\typings.ts`->`router.ts`
- `runtime\handler\db-proxy.ts`->`router.ts`
- `runtime\handler\invoke.ts`->`router.ts`
- `runtime\handler\openapi.ts`->`router.ts`

## Func
- func.name
- func.desc
- func.methods
- func.tags
- func.source
    - .code
    - .compiled

## file
LAFRUN\SRC\RUNTIME
│  config.ts  配置文件
│  constants.ts  常量
│  db.ts 数据库管理 DatabaseAgent
│  index.ts 运行 run()
│  init.ts  初始化app 安装依赖
│  local.ts  读取本地-将删除
│
├─handler
│      db-proxy.ts handleDatabaseProxy
│      invoke.ts handleInvokeFunction
│      openapi.ts handleOpenAPIDefinition
│      router.ts 路由入口
│      typings.ts handlePackageTypings
│
└─support
    │  cloud-sdk.ts 云函数sdk初始化
                    createCloudSdk
                    invokeInFunction
    │  init-hook.ts 执行__init__函数
    │  lang.ts  语言工具
    │  logger.ts 日志工具
    │  lsp.ts LSP Server  LspWebSocket launchLsp
    │  module-hot-reload.ts 模块热重载
    │  openapi.ts OpenAPI支持
    │  policy.ts  PolicyAgent 
                    策略代理类
                     - 管理多个策略
                     - 初始化策略注入器
    │  token.ts jwt工具
    │  types.ts 类型
    │  utils.ts 工具库
    │  ws.ts ws相关
    │
    ├─change-stream
    │      conf-change-stream.ts 配置文件变更流
    │
    └─engine
            cache.ts 函数缓存 FunctionCache
            console.ts 控制台日志输出 Console
            executor.ts 函数执行器 FunctionExecutor
            index.ts 入口
            module.ts 模块管理 FunctionModule
            types.ts 类型

## process.env Config
- *`DB_URI`  数据库url
- *`SERVER_SECRET`  服务器密钥
- `LOG_LEVEL` || 'debug'  日志级别
- `DISPLAY_LINE_LOG_LEVEL` || 'error' 显示行日志级别
- `LOG_DEPTH` || 1   对象日志深度
- `__PORT` || 8000  端口
- *`NODE_ENV` 环境
- `RUNTIME_IMAGE` || 'lafyun/runtime-node:latest' 运行时镜像
- *`APPID` 应用id
- `NPM_INSTALL_FLAGS` || '' npm install 参数
- `REQUEST_LIMIT_SIZE` || '10mb' 请求限制大小
- `LOG_SERVER_URL` || '' 日志服务器地址
- `LOG_SERVER_TOKEN` || '' 日志服务器token
- `CHANGE_STREAM_RECONNECT_INTERVAL` || 3000 变更流重连间隔
- `OSS_INTERNAL_ENDPOINT` || '' OSS内部endpoint
- *`OSS_EXTERNAL_ENDPOINT`  OSS外部endpoint
- `DISABLE_MODULE_CACHE` || false 禁用模块缓存
- `CUSTOM_DEPENDENCY_BASE_PATH` || '/tmp/custom_dependency' 自定义依赖基础路径
