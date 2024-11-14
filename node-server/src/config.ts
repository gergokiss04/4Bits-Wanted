
export class Config {

  listenHostname: string
  listenPort: number

  staticRoots: string[]

  apiPath: string


  constructor(dict: {}) {
    this.listenHostname = Config.require(dict, ['listen', 'hostname'])
    this.listenPort = Config.require(dict, ['listen', 'port'])

    this.staticRoots = Config.require(dict, ['static', 'directory'])

    this.apiPath = Config.require(dict, ['api', 'path'])
  }


  static require<T>(dict: {[key: string]: any}, path: string[]): T {
    for(let i = 0; i < path.length - 1; i++) {
      dict = dict[path[i]]
    }

    return dict[path[path.length - 1]]
  }

}
