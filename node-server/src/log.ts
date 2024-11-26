import colors from 'colors/safe.js'
import * as fs from 'fs/promises'


class Streams {

  static logFile: fs.FileHandle | undefined

  static async write(msg: string, opts: LogOptions): Promise<void> {
    if(opts.stdout) {
      console.log(msg)
    }

    if(opts.stderr) {
      console.error(msg)
    }

    if(opts.file) {
      //if(!Streams.logFile) Streams.logFile = await fs.open('log', 'a')

      /*
         FIXME
      const stream = Streams.logFile.createWriteStream() // Elvileg unsafe egyszerre többször írni simán a fileba
      try {
        stream.write(msg)
      } finally {
        stream.close()
      }
      */
    }
  }

}

export class LogOptions {

  static normal: LogOptions
  static info: LogOptions
  static warn: LogOptions
  static error: LogOptions

  stdout: boolean
  stderr: boolean
  file: boolean

  constructor(dict: {[key: string]: any}) {
    this.stdout = typeof dict['stdout'] === 'boolean' ? dict['stdout'] : false
    this.stderr = typeof dict['stderr'] === 'boolean' ? dict['stderr'] : false
    this.file = typeof dict['file'] === 'boolean' ? dict['file'] : false
  }

  static parseBool(text: string): boolean {
    switch(text) {
      case 'true': return true
      case 'false': return false
      default: throw new Error(`Expected either 'true' or 'false' for boolean value (not ${text})`)
    }
  }

}


export function sanitize(msg: any): string {
  return JSON.stringify(msg);
}

function write(msg: string, opts: LogOptions): void {
  Streams.write(msg, opts) // Direkt nincs bevárva
}


export function normal(msg: string): void {
  write(msg, LogOptions.normal)
}

export function info(msg: string): void {
  write(colors.gray(msg), LogOptions.info)
}

export function warn(msg: string): void {
  write(colors.yellow(msg), LogOptions.warn)
}

export function error(msg: string): void {
  write(colors.red(msg), LogOptions.error)
}


export function exception(e: Error | any, flavorText: string | null = null): void {
  flavorText ??= 'Unhandled exception';
  error(`${flavorText}: ${sanitize(e)}`)
}
