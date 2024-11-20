import * as dictutil from './dictutil.js'


export class Config {

  listenHostname: string
  listenPort: number

  rootFile: string | null
  staticRoots: string[]

  apiPrefixParts: string[]


  constructor(dict: {}) {
    this.listenHostname = dictutil.require(dict, ['listen', 'hostname'])
    this.listenPort = dictutil.require(dict, ['listen', 'port'])

    this.rootFile = dictutil.optional(dict, ['static', 'rootFile'])
    this.staticRoots = dictutil.require(dict, ['static', 'roots'])

    this.apiPrefixParts = dictutil.require<string>(dict, ['api', 'prefix']).split('/')
  }


  maybeApiPath(path: string[]): string[] | false {
    if(path.length < this.apiPrefixParts.length) return false

    for(const i in this.apiPrefixParts) {
      if(path[i] != this.apiPrefixParts[i]) return false
    }

    return path.slice(this.apiPrefixParts.length)
  }

}
