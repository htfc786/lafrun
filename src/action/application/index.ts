import * as path from 'node:path'
import * as fs from 'node:fs'
import { AppSchema } from '../../schema/app'

import {
  FUNCTION_SCHEMA_DIRECTORY,
  GITIGNORE_FILE,
  GLOBAL_FILE,
  PACKAGE_FILE,
  TEMPLATE_DIR,
  TSCONFIG_FILE,
  TYPE_DIR,
} from '../../common/constant'
import { ensureDirectory, exist } from '../../util/file'

import { getEmoji } from '../../util/print'
import { ProjectSchema } from '../../schema/project'
import { getBaseDir } from '../../util/sys'

export async function init(appid: string, options: any) {
  if (AppSchema.exist()) {
    console.log(`${getEmoji('❌')} The .app.yaml file already exists in the current directory. Please change the directory or delete the .app.yaml file`)
    return
  }
  
  const app = {
    appid: appid || '00000',
    name: options.name || '',
    description: options.description || '',
  }

  // init app schema
  const appSchema: AppSchema = {
    appid: app.appid,
    name: app.name,
  }
  AppSchema.write(appSchema)

  if (options.basicMode) {
    console.log(`${getEmoji('🚀')} application init schema success`)
    return
  }

  if (!ProjectSchema.exist()) {
    // init project schema
    const projectSchema: ProjectSchema = {
      version: '1.0.0',
      name: app.name,
      metadata: {
        description: app.description,
      }
    }
    ProjectSchema.write(projectSchema)

    // init function
    initFunction()

    // init policy
    initPolicy()
  }

  console.log(`${getEmoji('🚀')} application init success`)
}

function initFunction() {
  // if not exist，create functions directory
  ensureDirectory(path.join(getBaseDir(), FUNCTION_SCHEMA_DIRECTORY))

  const typeDir = path.resolve(getBaseDir(), TYPE_DIR)
  ensureDirectory(typeDir)

  // from template dir
  const templateDir = path.resolve(__dirname, '../../../', TEMPLATE_DIR)

  // generate global.d.ts
  const fromGlobalFile = path.resolve(templateDir, GLOBAL_FILE)
  const outGlobalFile = path.resolve(typeDir, GLOBAL_FILE)
  fs.writeFileSync(outGlobalFile, fs.readFileSync(fromGlobalFile, 'utf-8'))

  // generate package.json
  const fromPackageFile = path.resolve(templateDir, PACKAGE_FILE)
  const outPackageFile = path.resolve(getBaseDir(), PACKAGE_FILE)
  fs.writeFileSync(outPackageFile, fs.readFileSync(fromPackageFile, 'utf-8'))

  // generate tsconfig.json
  const fromTsConfigFile = path.resolve(templateDir, TSCONFIG_FILE)
  const outTsConfigFile = path.resolve(getBaseDir(), TSCONFIG_FILE)
  fs.writeFileSync(outTsConfigFile, fs.readFileSync(fromTsConfigFile, 'utf-8'))

  // generate .gitignore
  const fromGitIgnoreFile = path.resolve(templateDir, GITIGNORE_FILE)
  const outGitIgnoreFile = path.resolve(getBaseDir(), '.' + GITIGNORE_FILE)
  if (!exist(outGitIgnoreFile)) {
    fs.writeFileSync(outGitIgnoreFile, fs.readFileSync(fromGitIgnoreFile, 'utf-8'))
  }
}

function initPolicy() {
  ensureDirectory(path.join(getBaseDir(), 'policies'))
}
