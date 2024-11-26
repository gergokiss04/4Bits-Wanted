import * as dictutil from './dictutil.js'
import { LogOptions } from './log.js'


export class Config {

  logNormal: LogOptions
  logInfo: LogOptions
  logWarn: LogOptions
  logError: LogOptions

  listenHostname: string
  listenPort: number

  rootFile: string | null
  staticRoots: string[]

  apiPrefixParts: string[]
  apiDriver: 'memory' | 'db'


  constructor(dict: {}) {
    this.listenHostname = dictutil.require(dict, ['listen', 'hostname'])
    this.listenPort = dictutil.require(dict, ['listen', 'port'])

    this.rootFile = dictutil.optional(dict, ['static', 'rootFile'])
    this.staticRoots = dictutil.require(dict, ['static', 'roots'])

    this.apiPrefixParts = dictutil.require<string>(dict, ['api', 'prefix']).split('/')
    {
      const val = dictutil.require<string>(dict, ['api', 'driver'])
      if(val === 'memory' || val === 'db') this.apiDriver = val
      else throw new Error('Invalid API driver')
    }

    this.logNormal = new LogOptions(dictutil.optional<{[key: string]: string}>(dict, ['log', 'normal']) ?? {})
    this.logInfo = new LogOptions(dictutil.optional<{[key: string]: string}>(dict, ['log', 'normal']) ?? {})
    this.logWarn = new LogOptions(dictutil.optional<{[key: string]: string}>(dict, ['log', 'normal']) ?? {})
    this.logError = new LogOptions(dictutil.optional<{[key: string]: string}>(dict, ['log', 'normal']) ?? {})
  }


  maybeApiPath(path: string[]): string[] | false {
    if(path.length < this.apiPrefixParts.length) return false

    for(const i in this.apiPrefixParts) {
      if(path[i] != this.apiPrefixParts[i]) return false
    }

    return path.slice(this.apiPrefixParts.length)
  }

}
