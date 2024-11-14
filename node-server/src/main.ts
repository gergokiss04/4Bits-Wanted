// A /wanted/build-be teszi a react a build eredményét.

// Load HTTP module
import http from 'http'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import Mime from 'mime/lite'

import * as log from './log.js'
import { Config } from './config.js'
import { Api } from './api.js'



const configPath = process.env.WANTED_CONFIG || 'wanted-config.json';
log.info(`Reading config at '${configPath}'`)

const config = new Config(
                 JSON.parse(
                 fsSync.readFileSync(
                 process.env.WANTED_CONFIG || 'wanted-config.json', 'utf-8')
))


async function serveStatic(res: http.ServerResponse<http.IncomingMessage>, url: string): Promise<void> {
  let file: fs.FileHandle | undefined
  try {
    let filePath : string | undefined = undefined
    for(const root of config.staticRoots) {
      const trialPath = path.join(root, url)
      if((await fs.stat(trialPath)).isFile()) {
        filePath = trialPath
        break
      }
    }

    // Egyik root alatt sem létezik
    if(!filePath) {
      let err = new Error() as NodeJS.ErrnoException
      err.code = 'ENOENT'
      throw err
    }

    const mimeType: string = Mime.getType(filePath) || 'application/octet-stream'

    file = await fs.open(filePath, 'r')
    const expectedLength = (await file.stat()).size
    let totalBytes = 0

    res.setHeader('Content-Length', expectedLength)
    res.setHeader('Content-Type', mimeType)
    const buffer: Buffer = Buffer.alloc(2**16)
    while(true) {
      const result: fs.FileReadResult<Buffer> = await file.read(buffer, 0, buffer.length)
      totalBytes += result.bytesRead
      if(result.bytesRead <= 0) break

      const wrote: boolean = res.write(buffer.subarray(0, result.bytesRead))
      if(!wrote) await new Promise(resolve => res.once('drain', resolve)) // Ez nagyon fontos! A write visszatérési értékét nem szabad figyelmen kívül hagyni.
    }
    res.end()

    if(totalBytes != expectedLength) log.warn(`Expected ${expectedLength} bytes (previously sent as Content-Length), but found ${totalBytes} when reading ${log.sanitize(url)}`)
  } catch(error) {
    if(error instanceof Error) {
      switch((error as NodeJS.ErrnoException).code) {
        case 'ENOENT':
        case 'ERR_FS_EISDIR':
          log.info(`Not found or is a directory: ${log.sanitize(url)}`)
          res.statusCode = 404
          res.end()
          return
      }
    }
    throw error
  } finally {
    file?.close()
  }
}


const server = http.createServer()

server.on('request', async (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
  let url = path.normalize(req.url ?? '/')

  log.info(`Request from ${log.sanitize(req.socket.remoteAddress)} for ${log.sanitize(url)}`)

  if(url.startsWith(config.apiPath)) {
    const apiPath: string = path.normalize(url.substring(config.apiPath.length))
    log.info(`API call: ${log.sanitize(apiPath)}`)
  } else {
    if(url == '/' && config.rootFile) url = config.rootFile
    serveStatic(res, url)
  }

  // Set the response HTTP header with HTTP status and Content type
  //res.writeHead(200, { "Content-Type": "text/plain" })

  // Send the response body "Hello World"
  //res.end("Hello World\n")

})

// Prints a log once the server starts listening
server.listen(config.listenPort, config.listenHostname, function () {
  console.log(`Server listening on http://${config.listenHostname}:${config.listenPort}/`)
})
