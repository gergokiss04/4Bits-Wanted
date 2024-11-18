import * as dictutil from './dictutil.js'


export class Config {

  listenHostname: string
  listenPort: number

  rootFile: string | null
  staticRoots: string[]

  apiPrefix: string


  constructor(dict: {}) {
    this.listenHostname = dictutil.require(dict, ['listen', 'hostname'])
    this.listenPort = dictutil.require(dict, ['listen', 'port'])

    this.rootFile = dictutil.optional(dict, ['static', 'rootFile'])
    this.staticRoots = dictutil.require(dict, ['static', 'roots'])

    this.apiPrefix = dictutil.require(dict, ['api', 'prefix'])
  }

}
