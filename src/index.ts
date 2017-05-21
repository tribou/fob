const log = require('debug')('fob:index')
const Path = require('path')


// Parse command line options
const yargs = require('yargs')


  .usage('Usage: fob [options]')
  .example('fob --config config/webpack.js')


  .option('c', {
    alias: 'config',
    default: 'webpack.config.js',
    // This framework must be run in the root directory of the project
    coerce: Path.resolve,
    describe: 'Specify the path to the webpack config file',
    type: 'string'
  })


  .help()
  .alias('h', 'help')
  .argv


log('config:', yargs.config)


// function delayedHello(name: string, delay: number = 2000): Promise<string> {
//   return new Promise((resolve) => setTimeout(() => resolve(`Hello, ${name}`), delay));
// }

// Below is an example of using TSLint errors suppression
// Here it's supressing missing type definitions for greeter function

// export default async function greeter(name) { // tslint:disable-line typedef
//   return await delayedHello(name);
// }
