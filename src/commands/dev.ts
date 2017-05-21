import Debug from 'debug'
// Import Nodemon from 'nodemon'
import { IYargs } from '../'
import { yarn } from './yarn'

const log: Function = Debug('fob:dev')

export async function dev (yargs: IYargs): Promise<void> {

  log('Starting dev', yargs)
  await yarn()

}
