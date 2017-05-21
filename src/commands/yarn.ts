import Debug from 'debug'
import * as Glob from 'glob'
import * as Path from 'path'
import { exec } from 'shelljs'

const log: Function = Debug('fob:yarn')

export function yarn (): Promise<void> {

  const yarnFiles: string[] = Glob.sync('./bin/yarn*.js')
  if (yarnFiles.length < 1) {

    throw Error(`Yarn not found in ${Path.resolve('./bin/yarn*.js')}`)

  }
  // Use latest yarn available
  const yarnjs: string = Path.resolve(yarnFiles[yarnFiles.length - 1])

  const cmd: string = `node ${yarnjs} install --ignore-scripts`
  log(cmd)
  log('CWD:', process.cwd())
  return Promise.resolve(exec(cmd))

}
