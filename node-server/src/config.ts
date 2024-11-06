
class Config {

  listenHostname: number


  constructor(dict: {}) {
  }


  static require<T>(dict: {[key: string]: any}, path: string[]): T {
    for(let i = 0; i < path.length - 1; i++) {
      dict = dict[path[i]]
    }

    // TODO
    return dict[path[path.length - 1]]
  }

}
