// tslint:disable no-console
import * as Chalk from 'chalk'
import * as Child from 'child_process'
import * as Chokidar from 'chokidar'
import Debug from 'debug'
import * as Debounce from 'lodash/debounce'
import * as Path from 'path'
import * as PsTree from 'ps-tree'
import { exec, rm } from 'shelljs'
import { IYargs } from '../'
import { yarn } from './yarn'

const log: Function = Debug('fob:dev')

const defaultIgnored: string[] = [
  '.git/**/*',
  'node_modules',
  'bower_components',
  'coverage',
  '.sass_cache',
  '.nyc_output',
]

const flowPrefix: string = Chalk.green.dim('[FLOW]')
// Const devPrefix: string = Chalk.yellow.dim('[APP]')

function kill (child: Child.ChildProcess): void {

  PsTree(child.pid, (err, kids) => {

    if (err) {

      log('ERROR', err)

    }
    Child.spawn('kill', ['-s', 'SIGINT', child.pid.toString()].concat(kids.map((p) => {

      return p.PID

    })))

  })

}

interface IExecute {
  script: string[],
  prefix: string,
  child?: Child.ChildProcess,
}

function execute (opts: IExecute): Child.ChildProcess {

  const { script, prefix } = opts

  log(
    prefix,
    Chalk.yellow.dim('Restarting process'),
  )

  if (opts.child) {

    kill(opts.child)

  }

  const child: Child.ChildProcess = exec(script.join(' '), {
    async: true,
    silent: true,
  })

  function handleOutput (data: string): void {

    if (data) {

      console.log(
        prefix,
        data.toString().replace(/(\n|\r)/g, `\n${prefix} `),
      )

    }

  }

  child.stdout.on('data', handleOutput)
  child.stderr.on('data', handleOutput)
  child.on('exit', (code: number) => {

    const message: string = code
      ? `Process exited with status ${code}`
      : 'Process exited'
    console.log(
      prefix,
      Chalk.yellow.dim(message),
    )


  })

  // Clean up the garbage
  process.on('exit', () => {

    console.log(
      prefix,
      Chalk.red.dim('Killing child process'),
    )
    kill(child)

  })

  return child

}


export async function dev (yargs: IYargs): Promise<void> {

  log('Starting dev', yargs)
  const bin: string = Path.resolve('./node_modules/.bin')


  // Run yarn install
  await yarn()


  // Remove build directory
  const build: string = Path.resolve('./build')
  log('rm', build)
  if (build) {
    rm('-rf', build)
  }


  // Kick off flowtype checking
  const flowScript: string[] = [
    `${bin}/flow status`,
    ' --color always',
    `${Path.resolve('.')};`,
    'test $? -eq 0 -o $? -eq 2',
  ]

  let files: string[] = []
  let flowReady: boolean = false
  let child: Child.ChildProcess
  const debouncedFlow: Function = Debounce(() => {

    if (files.length > 0) {
      console.log(
        flowPrefix,
        Chalk.yellow(
          `Files changed: \n${flowPrefix}`,
          files.join(`\n${flowPrefix}`),
        ),
      )
    }

    if (child) {

      child.kill()

    }
    child = execute({
      script: flowScript,
      prefix: flowPrefix,
      child,
    })

    files = []

  }, 100)

  console.log(
    flowPrefix,
    Chalk.yellow.dim('Starting process:', flowScript.join(' ')),
  )

  function handleWatchFlow (path: string): void {

    if (flowReady) {

      files.push(path)
      debouncedFlow()

    }

  }

  Chokidar.watch([
    './**/*.css',
    './**/*.js',
    './**/*.json',
  ], {
    ignored: [
      '.eslintcache',
      'build',
      '~*',
    ].concat(defaultIgnored),
    followSymlinks: false,
    cwd: Path.resolve('.'),
  })
  .on('ready', () => {

    debouncedFlow()
    flowReady = true

  })
  .on('add', handleWatchFlow)
  .on('change', handleWatchFlow)
  .on('unlink', handleWatchFlow)

}
