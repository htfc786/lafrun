import * as path from 'node:path'
import * as fs from 'node:fs'
import Table from 'cli-table3'
import { exist, remove } from '../../util/file'
import { getEmoji } from '../../util/print'
import { getBaseDir } from '../../util/sys'
import { confirm } from '../../common/prompts'
import { FunctionSchema } from '../../schema/function'
import { CreateFunctionDto } from '../../types'
import { getLocalFuncNames, removeFunction } from '../../common/function'
import { FUNCTION_CODE_SUFFIX, FUNCTION_SCHEMA_DIRECTORY } from '../../common/constant'

export async function create(
  funcName: string,
  options: {
    websocket: boolean
    methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD')[]
    tags: string[]
    description: string
  },
) {
  const createDto: CreateFunctionDto = {
    name: funcName,
    description: options.description,
    methods: options.methods,
    code: `import cloud from '@lafjs/cloud'\n\nexport default async function (ctx: FunctionContext) {\n  console.log('Hello World')\n  return { data: 'hi, laf' }\n}\n`,
    tags: options.tags,
  }
  // check if function exist
  if (FunctionSchema.exist(funcName)) {
    const isConfirm = await confirm(`Function ${funcName} already exist, do you want to overwrite it?`)
    if (!isConfirm) {
      console.log(`${getEmoji('❌')} function ${funcName} not created`)
      return
    }
    removeFunction(funcName)
  }
  // create function
  const functionSchema: FunctionSchema = {
    name: createDto.name,
    desc: createDto.description,
    methods: createDto.methods,
    tags: createDto.tags,
  }
  FunctionSchema.write(createDto.name, functionSchema)
  const codePath = path.join(getBaseDir(), FUNCTION_SCHEMA_DIRECTORY, createDto.name + FUNCTION_CODE_SUFFIX)
  fs.writeFileSync(codePath, createDto.code)
  // finish!
  console.log(`${getEmoji('✅')} function ${funcName} created`)
}

export async function list() {
  // get local functions
  const funcNames = getLocalFuncNames()

  const table = new Table({
    head: ['name', 'desc', 'websocket', 'methods', 'tags'],
  })
  for (const funcName of funcNames) {
    const func = FunctionSchema.read(funcName)
    table.push([
      func.name,
      func.desc,
      func.name==='__websocket__' ? 'true' : 'false',
      func.methods.join(','),
      func.tags.join(','),
    ])
  }

  console.log(table.toString())
  if (funcNames.length === 0) {
    console.log(`${getEmoji('⚠️')} no functions found, create one first!`)
  }
}

export async function del(funcName: string) {
  // ask for
  const isConfirm = await confirm(`Are you sure you want to delete function ${funcName}?`)
  if (!isConfirm) {
    console.log(`${getEmoji('❌')} function ${funcName} not deleted`)
    return
  }
  // check if function exist
  if (!FunctionSchema.exist(funcName)) {
    console.error(`${getEmoji('❌')} function ${funcName} not found`)
    return
  }
  // delete function
  FunctionSchema.delete(funcName)

  const funcPath = path.join(getBaseDir(), FUNCTION_SCHEMA_DIRECTORY, funcName + FUNCTION_CODE_SUFFIX)
  if (exist(funcPath)) {
    remove(funcPath)
  }
  console.log(`${getEmoji('✅')} function ${funcName} deleted`)
}

// export async function exec(
//   funcName: string,
//   options: {
//     log: string
//     requestId: boolean
//     method: string
//     query: string
//     data: string
//     headers: any
//   },
// ) {
//   // compile code
//   const codePath = path.join(getBaseDir(), 'functions', funcName + FUNCTION_CODE_SUFFIX)
//   if (!exist(codePath)) {
//     console.error(`${getEmoji('❌')} function ${funcName} not found, please pull or create it!`)
//     process.exit(1)
//   }
//   const code = fs.readFileSync(codePath, 'utf-8')
//   const compileDto: CompileFunctionDto = {
//     code,
//   }
//   const appSchema = AppSchema.read()
//   const func = await functionControllerCompile(appSchema.appid, urlencode(funcName), compileDto)

//   // transform headers json string to object. -H '{"Content-Type": "application/json"}'
//   if (options.headers) {
//     try {
//       options.headers = JSON.parse(options.headers)
//     } catch (e) {
//       options.headers = {}
//     }
//   }

//   // transform data json string to object. eg -d '{"key": "val"}' or  -d 'key=val'
//   if (options.data) {
//     try {
//       options.data = JSON.parse(options.data)
//     } catch (e) {
//       options.data = options.data
//     }
//   }

//   const res = await invokeFunction(
//     appSchema.invokeUrl || '',
//     appSchema?.function?.developToken,
//     funcName,
//     func,
//     options.method,
//     options.query,
//     options.data,
//     options.headers,
//   )

//   // print requestId
//   if (options.requestId) {
//     console.log(`requestId: ${res.requestId}`)
//   }

//   // print response
//   console.log(res.res)

//   // print log
//   if (options.log) {
//     await printLog(appSchema.appid, res.requestId)
//   }
// }
