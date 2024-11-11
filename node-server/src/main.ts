// A /wanted/build-be teszi a react a build eredményét.

// Load HTTP module
import http from 'http'
import * as fs from 'fs'

import { Config } from './config'


const config = new Config(
                 JSON.parse(
                 fs.readFileSync(
                 process.env.WANTED_CONFIG || 'wanted-config.json', 'utf-8')
))

// Create HTTP server
const server = http.createServer(function (req, res) {
  console.log(`Request: ${req.url}`) // HACK
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" })

  // Send the response body "Hello World"
  res.end("Hello World\n")
});

// Prints a log once the server starts listening
server.listen(config.listenPort, config.listenHostname, function () {
  //console.log(`Server running at http://${hostname}:${port}/`)
});
