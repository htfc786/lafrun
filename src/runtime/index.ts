import Config from './config'
import { logger } from './support/logger'

import express from 'express'
import { router } from './handler/router'
import * as init from './init'
import { FunctionCache } from './support/engine/cache'

// init static method of class
import './support/cloud-sdk'

import { createCloudSdk } from './support/cloud-sdk'

export function run(funcPath?: string) {
  logger.info('lafjs runtime start...')

  // initialize function
  FunctionCache.initialize(funcPath)

  // init source map support
  init.initSourceMapSupport()

  // set createCloudSdk to global
  // hack: set createCloudSdk to global object to make it available in @lafjs/cloud package
  globalThis.createCloudSdk = createCloudSdk

  const app = express()

  // init app
  init.initExpressApp(app)
  
  // init error catcher
  init.initErrorCatcher()

  // use router
  app.use(router)

  // start server
  const server = app.listen(Config.PORT, () =>
    logger.info(`server ${process.pid} listened on ${Config.PORT}`),
  )

  // WebSocket upgrade & connect
  init.initWebSocket(server)

  // gracefully Exit
  init.initGracefullyExit(server)
}
export default run;