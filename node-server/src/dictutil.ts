

enum Type {
  "undefined",
  "object",
  "boolean",
  "number",
  "bigint",
  "string",
  "symbol",
  "function"
}



function get(dict: {[key: string]: any}, path: string[]): any {
  for(let i = 0; i < path.length - 1; i++) {
    dict = dict[path[i]]
  }

  return dict[path[path.length - 1]]
}

export function require<T>(dict: {[key: string]: any}, path: string[]): T {
  // TODO típusellenőrzés
  const found = get(dict, path)
  if(found === undefined) throw new Error(`Required element missing: ${JSON.stringify(path)}`)
  return found
}

export function optional<T>(dict: {[key: string]: any}, path: string[]): T | null {
  // TODO típusellenőrzés
  const found = get(dict, path)
  return found
}
