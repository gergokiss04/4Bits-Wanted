// A /wanted/build-be teszi a react a build eredményét.

// Load HTTP module
import http from 'http'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'

import * as log from './log'
import { Config } from './config'


const config = new Config(
                 JSON.parse(
                 fsSync.readFileSync(
                 process.env.WANTED_CONFIG || 'wanted-config.json', 'utf-8')
))


async function serveStatic(res: http.ServerResponse<http.IncomingMessage>, url: string): Promise<void> {
  let file: fs.FileHandle | undefined
  try {
    file = await fs.open(path.join(config.staticDirectory, url), 'r')
    res.write(await file.read())
  } catch(error) {
    if(error instanceof Error) {
      switch((error as NodeJS.ErrnoException).code) {
        case 'EISDIR':
          res.statusCode = 404
          res.end()
          return
      }
    }
  } finally {
    file?.close()
  }
}


const server = http.createServer()

server.on('request', async (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
  const url = path.normalize(req.url ?? '/')

  log.info(`Request: ${log.sanitize(url)}`)

  if(url.startsWith(config.apiPath)) {
    const apiPath: string = path.normalize(url.substring(config.apiPath.length))
    log.info(`API call: ${log.sanitize(apiPath)}`)
  } else {
    serveStatic(res, url)
  }

  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" })

  // Send the response body "Hello World"
  res.end("Hello World\n")

})

// Prints a log once the server starts listening
server.listen(config.listenPort, config.listenHostname, function () {
  console.log(`Server listening on http://${config.listenHostname}:${config.listenPort}/`)
})
