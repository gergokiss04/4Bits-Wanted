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
  apiSecret: string
  apiAllowDebt: boolean
  apiReportErrorsToClient: boolean
  apiCacheLifetime: number

  apiMediaRoot: string
  apiMediaCapacity: number


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
    this.apiSecret = dictutil.require<string>(dict, ['api', 'secret'])
    this.apiAllowDebt = dictutil.optional<boolean>(dict, ['api', 'allowDebt']) ?? false
    this.apiReportErrorsToClient = dictutil.optional<boolean>(dict, ['api', 'reportErrorsToClient']) ?? false
    this.apiCacheLifetime = dictutil.require<number>(dict, ['api', 'cacheLifetime'])

    this.apiMediaRoot = dictutil.require<string>(dict, ['api', 'media', 'root'])
    this.apiMediaCapacity = dictutil.optional<number>(dict, ['api', 'media', 'capacity']) ?? 10

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
