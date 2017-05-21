#!/usr/bin/env node

import Debug from 'debug'
import * as Path from 'path'
import * as Yargs from 'yargs'

// Commands
import { dev } from './commands/dev'

const log: Function = Debug('fob:index')

export interface IYargs {
  _: string[],
  c: string,
  config: string,
}

// Parse command line options
// tslint:disable-next-line
const yargs: IYargs = Yargs


  .usage('Usage: fob [options]')
  .example('fob --config config/webpack.js')


  .option('c', {
    alias: 'config',
    default: 'webpack.config.js',
    // This framework must be run in the root directory of the project
    coerce: Path.resolve,
    describe: 'Specify the path to the webpack config file',
    type: 'string',
  })


  .command('dev', 'Launch development mode', {
  }, dev)


  .help()
  .alias('h', 'help')
  .argv


log('yargs:', yargs)


// Dev script is default
if (!yargs._[0]) {

  dev(yargs)

}
