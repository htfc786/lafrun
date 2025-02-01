# lafrun

## 依赖
cli: `commander`、`typescript`、`yaml`、`dayjs`、`node-emoji`、`prompts`、`cli-table3`、`@types/node`(--save-dev)
runtime: `express``cors``express-xml-bodyparser``dotenv``url``mongodb``database-proxy``ws``jsonwebtoken``pako``multer``node-modules-utils``chalk``lodash``source-map-support``@lafjs/cloud``openapi3-ts/oas30`

## 引用
- `runtime\handler\typings.ts`->`router.ts`
- `runtime\handler\db-proxy.ts`->`router.ts`
- `runtime\handler\invoke.ts`->`router.ts`
- `runtime\handler\openapi.ts`->`router.ts`

# Func
- func.name
- func.desc
- func.methods
- func.tags
- func.source
    - .code
    - .compiled

# file
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