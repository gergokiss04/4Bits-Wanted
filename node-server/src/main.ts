import http from 'http';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import Mime from 'mime/lite';
import * as cookie from 'cookie';
import * as formidable from 'formidable';

import * as log from './log.js';
import { Config } from './config.js';
import { Api } from './api.js';
import { MemoryApi } from './apis/memory.js';
import { DatabaseApi } from './apis/database.js';

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection in ${promise}, because: ${reason}`);
});

const configPath = process.env.WANTED_CONFIG || 'wanted-config.json';

// Konfinguráció betöltése
const config = new Config(
  JSON.parse(
    fsSync.readFileSync(
      process.env.WANTED_CONFIG || 'wanted-config.json', 'utf-8'
    )
  )
);

log.LogOptions.info = config.logInfo;
log.LogOptions.normal = config.logNormal;
log.LogOptions.warn = config.logWarn;
log.LogOptions.error = config.logError;

log.normal(`Reading config at '${configPath}'`);

// Kitaláljuk, melyik API implementációt akarjuk
let api: Api;
switch (config.apiDriver) {
  case 'memory':
    log.normal('Using MemoryApi');
    const memApi = new MemoryApi(config);
    memApi.logCallback = (msg) => log.info(`[MemoryApi] ${msg}`);
    memApi.loadTestData();
    api = memApi;
    break;

  case 'db':
    log.normal('Using DatabaseApi');
    log.warn('DatabaseApi isn\'t implemented yet');
    const dbApi = new DatabaseApi(config);
    api = dbApi;
    break;
}

export class Request {
  static readonly BODY_SIZE_LIMIT: number = 1024 * 1024; // 1M

  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | undefined;
  cleanPath: string;
  pathParts: string[];
  query: ParsedUrlQuery;
  cookies: Record<string, string | undefined>;

  constructor(req: IncomingMessage, res: ServerResponse<IncomingMessage>, cleanPath: string, urlParts: string[], query: ParsedUrlQuery) {
    this.req = req;
    this.res = res;

    const meth = (req.method ?? '').toUpperCase();
    if (['GET', 'PUT', 'POST', 'DELETE'].includes(meth ?? '')) this.method = meth as 'GET' | 'PUT' | 'POST' | 'DELETE';
    else this.method = undefined;

    this.cleanPath = cleanPath;
    this.pathParts = urlParts;
    this.query = query;
    this.cookies = cookie.parse(req.headers.cookie ?? '');
  }

  static constructFromReqRes(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Request {
    const parsed = url.parse(req.url ?? '/', true);

    const pathParts: string[] = [];
    for (const part of (parsed.pathname ?? '/').split('/')) {
      if (part.length <= 0 || part === '.') continue;
      if (part === '..') {
        if (pathParts.length > 0) pathParts.pop();
        continue;
      }
      pathParts.push(decodeURIComponent(part));
    }
    let reqUrl = path.join(...pathParts);
    const reqQuery: ParsedUrlQuery = parsed.query;

    return new Request(req, res, reqUrl, pathParts, reqQuery);
  }

  async writePatiently(chunk: any): Promise<void> {
    const wrote: boolean = this.res.write(chunk);
    if (!wrote) await new Promise(resolve => this.res.once('drain', resolve));
  }

  async readBody(): Promise<string> {
    return new Promise((resolve, reject) => {
      let body: string = '';
      let oversized = false;
      this.req.on('data', chunk => {
        if (oversized) return;

        if (body.length > Request.BODY_SIZE_LIMIT) {
          log.warn(`Oversized request (>${Request.BODY_SIZE_LIMIT}) truncated`);
          oversized = true;
          resolve(body);
          return;
        }
        const chunkString = chunk.toString();
        body += chunkString;
      });
      this.req.on('end', () => {
        resolve(body);
      });
      this.req.on('error', err => {
        reject(err);
      });
    });
  }

  async receiveImage(): Promise<string | undefined> {
    const opts = formidable.defaultOptions;
    opts.keepExtensions = true;
    const form = new formidable.IncomingForm();

    return new Promise(
      (resolve) => {
        form.parse(this.req, (err: any, _fields: formidable.Fields<string>, files: formidable.Files<string>) => {
          if (err) throw err;
          if (files.image === undefined) resolve(undefined);
          resolve(files.image![0].filepath);
        });
      }
    );
  }

  async sendFile(file: fs.FileHandle, mime: string): Promise<void> {
    const expectedLength = (await file.stat()).size;
    let totalBytes = 0;

    this.res.setHeader('Content-Length', expectedLength);
    this.res.setHeader('Content-Type', mime);
    const buffer: Buffer = Buffer.alloc(2 ** 16);
    while (true) {
      const result: fs.FileReadResult<Buffer> = await file.read(buffer, 0, buffer.length);
      totalBytes += result.bytesRead;
      if (result.bytesRead <= 0) break;

      await this.writePatiently(buffer.subarray(0, result.bytesRead));
    }

    if (totalBytes != expectedLength) log.warn(`Expected ${expectedLength} bytes (previously sent as Content-Length), but found ${totalBytes} when reading file`);
  }

  setCookie(name: string, value: string) {
    this.res.setHeader('Set-Cookie', `${name}=${value};`);
  }
}

// FIXME MÉG MINDIG A GC ZÁRJA BE NÉHA
async function serveStatic(request: Request, url: string): Promise<void> {
  url = path.normalize(url);
  let file: fs.FileHandle | undefined;
  try {
    let filePath: string | undefined = undefined;
    for (const root of config.staticRoots) {
      const trialPath = path.join(root, url);
      if ((await fs.stat(trialPath)).isFile()) {
        filePath = trialPath;
        break;
      }
    }

    if (!filePath) {
      let err = new Error() as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    }

    const mimeType: string = Mime.getType(filePath) || 'application/octet-stream';

    file = await fs.open(filePath, 'r');
    await request.sendFile(file, mimeType);
    request.res.end();
  } catch (error) {
    if (error instanceof Error) {
      switch ((error as NodeJS.ErrnoException).code) {
        case 'ENOENT':
        case 'ERR_FS_EISDIR':
          log.info(`Not found or is a directory: ${log.sanitize(url)}`);
          request.res.statusCode = 404;
          request.res.end();
          return;
      }
    }
    throw error;
  } finally {
    if (file !== undefined) await file.close();
  }
}

const server = http.createServer();

server.on('request', async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const request = Request.constructFromReqRes(req, res);
    log.info(`Request from ${log.sanitize(request.req.socket.remoteAddress)} for ${log.sanitize(req.url)} ${JSON.stringify(request.pathParts)}`);

    const maybeApiPath: string[] | false = config.maybeApiPath(request.pathParts);
    if (maybeApiPath !== false) {
      log.info(`API call: ${log.sanitize(maybeApiPath)}, query: ${log.sanitize(request.query)}`);
      await api.handle(request, maybeApiPath);
    } else {
      if (request.cleanPath == '.' && config.rootFile) await serveStatic(request, config.rootFile);
      else await serveStatic(request, request.cleanPath);
    }
  } catch (e) {
    log.exception(e);
  }
});

server.listen(config.listenPort, config.listenHostname, function () {
  log.normal(`Server listening on http://${config.listenHostname}:${config.listenPort}/`);
});