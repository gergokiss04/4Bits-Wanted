
export class Config {

  listenHostname: string
  listenPort: number


  constructor(dict: {}) {
    this.listenHostname = Config.require(dict, ['listen', 'hostname'])
    this.listenPort = Config.require(dict, ['listen', 'port'])
  }


  static require<T>(dict: {[key: string]: any}, path: string[]): T {
    for(let i = 0; i < path.length - 1; i++) {
      dict = dict[path[i]]
    }

    // TODO
    return dict[path[path.length - 1]]
  }

}
