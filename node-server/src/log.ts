import colors from 'colors/safe.js'

// TODO: ki-be lehet kapcsolni egyes logolási szinteket
// TODO: fájlba, stderr-re

export function sanitize(msg: any): string {
  return JSON.stringify(msg);
}

export function write(msg: string): void {
  console.log(msg)
}

export function info(msg: string): void {
  write(colors.gray(msg))
}

export function warn(msg: string): void {
  write(colors.yellow(msg))
}

export function error(msg: string): void {
  write(colors.red(msg))
}
