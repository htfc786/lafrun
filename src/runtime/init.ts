import { execSync } from 'child_process'
import Config from './config'

import { logger } from './support/logger'

import express from 'express'
import cors from 'cors'
import url from 'url'
import xmlparser from 'express-xml-bodyparser'
import { GetClientIPFromRequest, generateUUID } from './support/utils'
import { parseToken, splitBearerToken } from './support/token'

import { FunctionCache } from './support/engine'
import { WebSocketAgent } from './support/ws'
import { DatabaseAgent } from './db'
// import { LspWebSocket } from './support/lsp'

// async function main() {
//   try {
//     installPackages()
//   } catch (error) {
//     logger.error(error)
//     return 1
//   }

//   return 0
// }

// main()
//   .then((code) => {
//     process.exit(code)
//   })
//   .catch((err) => {
//     logger.error(err)
//     process.exit(2)
//   })

/**
 * Install packages
 * @param packages
 * @returns
 */
export function installPackages() {
  const deps = process.env.DEPENDENCIES
  if (!deps) {
    return
  }

  const flags = Config.NPM_INSTALL_FLAGS
  logger.info('run command: ', `npm install ${deps} ${flags}`)
  const r = execSync(`npm install ${deps} ${flags}`)
  console.log(r.toString())
}

/**
 * Check if node module exists
 * @param moduleName
 * @returns
 */
export function moduleExists(mod: string) {
  try {
    require.resolve(mod)
    return true
  } catch (_err) {
    return false
  }
}

//// ========
// init app when running

/**
 * Initialize source map support
 */
export function initSourceMapSupport() {
  require('source-map-support').install({
    emptyCacheBetweenOperations: true,
    overrideRetrieveFile: true,
    retrieveFile: (path) => FunctionCache.get(path)?.source.compiled,
  })
}

/**
 * Initialize express app
 * @param app express app
 */
export function initExpressApp(app: express.Application) {
  // 1. set CORS
  app.use(
    cors({
      origin: true,
      methods: '*',
      exposedHeaders: '*',
      credentials: true,
      maxAge: 86400,
    }),
  )

  // 2.fix x-real-ip while gateway not set
  app.use((req, _res, next) => {
    if (!req.headers['x-real-ip']) {
      req.headers['x-real-ip'] = GetClientIPFromRequest(req)
    }
    next()
  })

  // 3. set body-parser
  app.use(  // json
    express.json({
      limit: Config.REQUEST_LIMIT_SIZE
    }) as any
  )
  app.use(  // urlencoded
    express.urlencoded({
      limit: Config.REQUEST_LIMIT_SIZE,
      extended: true,
    }) as any,
  )
  app.use(  // raw
    express.raw({
      limit: Config.REQUEST_LIMIT_SIZE,
    }) as any,
  )
  app.use(  // xml
    xmlparser()
  )

  // 4. Parsing bearer token
  app.use(function (req, _, next) {
    const token = splitBearerToken(req.headers['authorization'] ?? '')
    const auth = parseToken(token) || null
    req['user'] = auth
    next()
  })

  // 5. set requestId
  app.use(function (req, res, next) {
    const requestId = (req['requestId'] = req.headers['x-request-id'] || generateUUID())
    res.set('request-id', requestId)
    next()
  })

}

/**
 * Initialize error catcher
 */
export function initErrorCatcher() {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Caught unhandledRejection:`, reason, promise)
  })
  
  process.on('uncaughtException', (err) => {
    logger.error(`Caught uncaughtException:`, err)
  })
}

/**
 * Initialize WebSocket upgrade & connect
 * @param server http server
 */
export function initWebSocket(server: any) {
  server.on('upgrade', (req, socket, head) => {
    const pathname = req.url ? url.parse(req.url).pathname : undefined
    if (pathname === '/_/lsp') {
      /// TODO
      // LspWebSocket.handleUpgrade(req, socket, head)
      return
    }

    WebSocketAgent.server.handleUpgrade(req, socket as any, head, (client) => {
      WebSocketAgent.server.emit('connection', client, req)
    })
  })
}

/**
 * Initialize gracefully Exit
 * @param server http server has been closed
 */
export function initGracefullyExit(server: any) {
  const gracefullyExit = async () => {
    // fix bug： when db is not ready, the process will not exit
    try {
      await DatabaseAgent.accessor.close()
      await server.close()
    } finally {
      logger.info('process gracefully exited!')
      process.exit(0)
    }
  }
  process.on('SIGTERM', gracefullyExit)
  process.on('SIGINT', gracefullyExit)
}