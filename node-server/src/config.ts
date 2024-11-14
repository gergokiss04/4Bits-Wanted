
export class Config {

  listenHostname: string
  listenPort: number

  rootFile: string | null
  staticRoots: string[]

  apiPath: string


  constructor(dict: {}) {
    this.listenHostname = Config.require(dict, ['listen', 'hostname'])
    this.listenPort = Config.require(dict, ['listen', 'port'])

    this.rootFile = Config.optional(dict, ['static', 'rootFile'])
    this.staticRoots = Config.require(dict, ['static', 'roots'])

    this.apiPath = Config.require(dict, ['api', 'path'])
  }


  static get(dict: {[key: string]: any}, path: string[]): any {
    for(let i = 0; i < path.length - 1; i++) {
      dict = dict[path[i]]
    }

    return dict[path[path.length - 1]]
  }

  static require<T>(dict: {[key: string]: any}, path: string[]): T {
    // TODO típusellenőrzés
    const found = Config.get(dict, path)
    if(!found) throw new Error(`Required configuration element missing: ${JSON.stringify(path)}`)
    return found
  }

  static optional<T>(dict: {[key: string]: any}, path: string[]): T | null {
    // TODO típusellenőrzés
    const found = Config.get(dict, path)
    return found
  }

}
