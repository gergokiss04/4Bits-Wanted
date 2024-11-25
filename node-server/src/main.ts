// A /wanted/build-be teszi a react a build eredményét.

// Lekérdezések amik kelleni fognak:
// - get/set rekord (egy tranzakcióba akár több, atomikusan!)
// - használják-e ezt a kép URL-t bárhol? (garbic collector)
// - user/más létrehozása, hogy legyen idje

import http from 'http'
import url from 'url'
import { ParsedUrlQuery } from 'querystring'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import Mime from 'mime/lite'

import * as log from './log.js'
import { Config } from './config.js'
import { MemoryApi } from './apis/memory.js'


process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection in ${promise}, because: ${reason}`)
})

const configPath = process.env.WANTED_CONFIG || 'wanted-config.json'
log.normal(`Reading config at '${configPath}'`)

// Konfinguráció betöltése
const config = new Config(
                 JSON.parse(
                 fsSync.readFileSync(
                 process.env.WANTED_CONFIG || 'wanted-config.json', 'utf-8')
))

const api = new MemoryApi()
api.loadTestData()


export class Request {

  req: http.IncomingMessage
  res: http.ServerResponse<http.IncomingMessage>
  cleanPath: string
  pathParts: string[]
  query: ParsedUrlQuery


  constructor(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, cleanPath: string, urlParts: string[], query: ParsedUrlQuery) {
    this.req = req
    this.res = res
    this.cleanPath = cleanPath
    this.pathParts = urlParts
    this.query = query
  }

  static constructFromReqRes(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>): Request {
    const parsed = url.parse(req.url ?? '/', true)

    const pathParts: string[] = []
    for(const part of path.normalize(parsed.pathname ?? '/').split('/')) {
      if(part.length <= 0) continue
      pathParts.push(decodeURIComponent(part))
    }
    let reqUrl = path.join(...pathParts)
    const reqQuery: ParsedUrlQuery = parsed.query

    return new Request(req, res, reqUrl, pathParts, reqQuery)
  }


  async writePatiently(chunk: any) : Promise<void> {
    // TODO ez jelzi a hibát ha nincs callbackje?
    const wrote: boolean = this.res.write(chunk)
    if(!wrote) await new Promise(resolve => this.res.once('drain', resolve)) // Ez nagyon fontos! A write visszatérési értékét nem szabad figyelmen kívül hagyni.
  }

}

// FIXME MÉG MINDIG A GC ZÁRJA BE NÉHA
async function serveStatic(request: Request, url: string): Promise<void> {
  // FONTOS!! Még joinolás előtt normalizáljuk, nehogy működjön ez: /%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd
  url = path.normalize(url)
  let file: fs.FileHandle | undefined
  try {
    // Nézzük, melyik root alatt található meg
    let filePath : string | undefined = undefined
    for(const root of config.staticRoots) {
      const trialPath = path.join(root, url)
      if((await fs.stat(trialPath)).isFile()) {
        filePath = trialPath
        break
      }
    }

    if(!filePath) {
      // Egyik root alatt sem létezik
      let err = new Error() as NodeJS.ErrnoException
      err.code = 'ENOENT'
      throw err
    }

    const mimeType: string = Mime.getType(filePath) || 'application/octet-stream'

    file = await fs.open(filePath, 'r')
    const expectedLength = (await file.stat()).size
    let totalBytes = 0

    request.res.setHeader('Content-Length', expectedLength)
    request.res.setHeader('Content-Type', mimeType)
    const buffer: Buffer = Buffer.alloc(2**16)
    while(true) {
      const result: fs.FileReadResult<Buffer> = await file.read(buffer, 0, buffer.length)
      totalBytes += result.bytesRead
      if(result.bytesRead <= 0) break

      await request.writePatiently(buffer.subarray(0, result.bytesRead))
    }
    request.res.end()

    if(totalBytes != expectedLength) log.warn(`Expected ${expectedLength} bytes (previously sent as Content-Length), but found ${totalBytes} when reading ${log.sanitize(url)}`)
  } catch(error) {
    if(error instanceof Error) {
      switch((error as NodeJS.ErrnoException).code) {
        case 'ENOENT':
        case 'ERR_FS_EISDIR':
          log.info(`Not found or is a directory: ${log.sanitize(url)}`)
          request.res.statusCode = 404
          request.res.end()
          return
      }
    }
    throw error
  } finally {
    if(file) await file.close()
  }
}


const server = http.createServer()

server.on('request', async (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
  try {
    const request = Request.constructFromReqRes(req, res)
    log.info(`Request from ${log.sanitize(request.req.socket.remoteAddress)} for ${log.sanitize(req.url)} ${JSON.stringify(request.pathParts)}`)

    const maybeApiPath: string[] | false = config.maybeApiPath(request.pathParts)
    if(maybeApiPath !== false) {
      log.info(`API call: ${log.sanitize(maybeApiPath)}, query: ${log.sanitize(request.query)}`)
      await api.handle(request, maybeApiPath)
    } else {
      if(request.cleanPath == '.' && config.rootFile) await serveStatic(request, config.rootFile)
      else await serveStatic(request, request.cleanPath)
    }
  } catch(e) {
    log.exception(e)
  }
})

server.listen(config.listenPort, config.listenHostname, function () {
  log.normal(`Server listening on http://${config.listenHostname}:${config.listenPort}/`)
})
