import Debug from 'debug'
import Nodemon from 'nodemon'
import { IYargs } from './'
import { yarn } from './yarn'

const log: Function = Debug('fob:dev')

export async function dev (yargs: IYargs): void {

  log('Starting dev', yargs)
  await yarn()

}
