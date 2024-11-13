import colors from 'colors/safe'

// TODO: ki-be lehet kapcsolni egyes logolási szinteket
// TODO: fájlba, stderr-re

export function sanitize(msg: any): string {
  return JSON.stringify(msg);
}

export function log(msg: string): void {
  console.log(msg)
}

export function info(msg: string): void {
  log(colors.gray(msg))
}

export function warn(msg: string): void {
  log(colors.yellow(msg))
}

export function error(msg: string): void {
  log(colors.red(msg))
}
