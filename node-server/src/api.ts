import * as crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import * as fs from 'fs/promises'
import Mime from 'mime/lite'
import * as path from 'path'

import * as log from './log.js'
import { Config } from './config.js'
import { Request } from './main.js'
import { Cache } from './cache.js'
import { User, Offer, Category, Record } from './records.js'
import { MediaStager } from './mediastager.js'


class ApiCall {

  request: Request
  variables: string[]
  loggedInAs: User | null = null

  contentType: string | null = null


  constructor(request: Request, variables: string[]) {
    this.request = request
    this.variables = variables
  }

}


class Result {
  code: StatusCodes
  body: any | null

  constructor(code: StatusCodes, body: any | null) {
    this.code = code
    this.body = body
  }

}
type ApiMethod = (call: ApiCall) => Promise<Result>
type Endpoint = {path: string[], method: ApiMethod}


// TODO media garbic collector
export abstract class Api {

  private readonly config: Config
  sessionCookieName: string = 'wanted-session'

  userCache = new Cache<number, User>()
  offerCache = new Cache<number, Offer>()
  categoryCache = new Cache<number, Category>()
  mediaStagers = new Cache<number, MediaStager>()

  endpoints: Array<Endpoint> = Array()
  reportErrors = true // TO-DO konfigurálható

  allowDebt = false


  constructor(config: Config) {
    this.config = config

    // HACK expires fast
    this.userCache.populateCallback = this.fetchUser.bind(this)
    this.userCache.onDroppedCallback = (_, value: User) => { this.commitUser(value); value.dropEntangled(this.userCache) }
    this.userCache.expireSeconds = 1
    this.userCache.setGcInterval()

    this.offerCache.populateCallback = this.fetchOffer.bind(this)
    this.offerCache.onDroppedCallback = (_, value: Offer) => value.dropEntangled(this.offerCache)
    this.offerCache.expireSeconds = 1
    this.offerCache.setGcInterval()

    this.categoryCache.populateCallback = this.fetchCategory.bind(this)
    this.categoryCache.onDroppedCallback = (_, value: Category) => value.dropEntangled(this.categoryCache)
    this.categoryCache.expireSeconds = 1
    this.categoryCache.setGcInterval()

    this.mediaStagers.populateCallback = () => new MediaStager(this.config.apiMediaCapacity)
    this.mediaStagers.expireSeconds = 100000

    this.addEndpoint(['register'], this.epRegister)
    this.addEndpoint(['auth'], this.epAuth)
    this.addEndpoint(['authform'], this.epAuthForm)
    this.addEndpoint(['logout'], this.epLogout)
    this.addEndpoint(['users'], this.epUserList)
    this.addEndpoint(['users', 'self'], this.epGetUserSelf)
    this.addEndpoint(['users', '$'], this.epUserById)
    this.addEndpoint(['users', '$', 'bio'], this.epUserBio)
    this.addEndpoint(['users', '$', 'picture'], this.epUserPicture)
    this.addEndpoint(['users', '$', 'password'], this.epUserPassword)
    this.addEndpoint(['categories'], this.epCategoryList)
    this.addEndpoint(['offers'], this.epOfferList) // GET és POST is
    this.addEndpoint(['offers', 'random'], this.epRandomOffers)
    this.addEndpoint(['offers', '$'], this.epOfferById) // GET és DELETE is
    this.addEndpoint(['offers', '$', 'buy'], this.epOfferBuy)
    this.addEndpoint(['offers', '$', 'rating'], this.epOfferRating) // GET és POST is
    this.addEndpoint(['mediastager'], this.epMediaStager) // GET, POST, DELETE
    this.addEndpoint(['mediastager', '$'], this.epMediaStagerIndexed)
    this.addEndpoint(['mediastager', 'form'], this.epMediaStagerForm)
    this.addEndpoint(['media', '$'], this.epMedia)
  }


  addEndpoint(path: string[], method: ApiMethod) {
    this.endpoints.push({path, method})
  }


  async handle(request: Request, apiPath: string[]): Promise<void> {

    // Megkeressük, melyik endpoint útvonala illeszkedik a kérés útvonalával
    let matchedEndpoint: Endpoint | null = null
    let matchSlack: number = Infinity // Követi, hogy a legjobban illeszkedő endpointban hány $ van, hogy ha pl. van foo/$/bar, és a listában utána még szerepel a foo/mid/bar, akkor a második élvezzen előnyt, mert az specifikusabb.
    for(let endpoint of this.endpoints) {
      if(endpoint.path.length != apiPath.length) continue

      let good = true
      let slackHere = 0
      for(let i in endpoint.path) {
        if(endpoint.path[i] === '$') slackHere++
        if(endpoint.path[i] != '$' && apiPath[i] != endpoint.path[i]) {
          good = false
          break
        }
      }

      if(good && slackHere < matchSlack) {
        matchedEndpoint = endpoint
        matchSlack = slackHere
        if(matchSlack <= 0) break // Ennél már nem lehet jobb match
      }
    }

    if(matchedEndpoint !== null) {
      // Útvonalbeli változók kötése
      let variables: string[] = []
      for(let i in matchedEndpoint.path) {
        if(matchedEndpoint.path[i] == '$') {
          variables.push(apiPath[i])
          break
        }
      }

      const call = new ApiCall(request, variables)
      try {
        const cookieString = request.cookies[this.sessionCookieName]
        if(cookieString !== undefined && cookieString != 'x') {
          const token = JSON.parse(cookieString)
          const forUser: User | undefined = await this.userCache.tryGet(token['id'])
          if(forUser !== undefined && this.isSignatureValid(forUser, token['signature'])) {
            call.loggedInAs = forUser
          }
        }
      } catch(e) {
        if(e instanceof Error && e.name == 'SyntaxError') {
          request.setCookie(this.sessionCookieName, 'x')
          log.info('Client sent cookie with invalid JSON')
        } else {
          throw e
        }
      }

      try {
        const bound = matchedEndpoint.method.bind(this)
        const result = await bound(call)
        request.res.statusCode = result.code

        let body = result.body
        if(body !== undefined) {
          request.res.setHeader('Content-Type', call.contentType ?? 'application/json')
          body = (call.contentType === null && typeof result.body !== 'string' ? JSON.stringify(result.body) : result.body.toString())
          await request.writePatiently(body)
        }
      } catch(e: any) {
        let msg = `Unhandled exception during API call: ${e}`
        if(e instanceof Error) msg += `\n${e.stack}`;
        log.error(msg)

        request.res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        if(this.reportErrors) {
          request.res.setHeader('Content-Type', call.contentType ?? 'application/json')
          await request.writePatiently(JSON.stringify(e))
        }
      }

    } else {
      log.info(`No suitable API endpoint for ${log.sanitize(apiPath)}`)
      request.res.statusCode = StatusCodes.NOT_FOUND
      await request.writePatiently('No such API endpoint')
    }

    request.res.end()
  }


  skipPages<T>(iter: Iterator<T>, count: number): Iterator<T> {
    const PAGE_SIZE = 100

    while(count-- > 0) {
      for(let i = 0; i < PAGE_SIZE; i++) {
        if(!iter.next()) break
      }
    }

    return iter
  }

  static errorMissingProp(name: string): Result {
    return new Result(StatusCodes.BAD_REQUEST, `Missing required property "${name}"`)
  }

  static errorMethodNotAllowed(): Result {
    return new Result(StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed')
  }

  static errorAuthRequired(): Result {
    return new Result(StatusCodes.UNAUTHORIZED, 'You must be logged in to do this')
  }

  isPasswordGood(pass: string): boolean {
    return pass.length > 0
  }

  hashPassword(pass: string, salt: number): string {
    return crypto.createHash('sha256' /* TO-DO konfigurálható */)
    .update(this.config.apiSecret)
    .update(salt.toString())
    .update(pass)
    .digest('hex')
  }

  getTokenSignature(user: User): string {
    return crypto.createHash('sha256')
    .update(this.config.apiSecret)
    .update(user.name)
    .update(user.password) // Genuis! Ha megváltoztatja a jelszavát, akkor többé nem lesz jó a signature
    .digest('hex')
  }

  isSignatureValid(user: User, signature: string): boolean {
    let result = false
    // Ez a ciklus azért jó, mert szórakozik a metódus futásidejével.
    for(let i = 0; i < 1 && Math.random() > 0.1; i++) {
      result = this.getTokenSignature(user) === signature
    }
    return result
  }

  async getStager(user: User): Promise<MediaStager> {
    const result = await this.mediaStagers.tryGet(user.id)
    if(result === undefined) throw new Error('Unreachable')
    return result
  }

  async parseBody(request: Request): Promise<any | Result> {
    let body
    try {
      body = JSON.parse(await request.readBody())
    } catch(e) {
      if(e instanceof Error && e.name == 'SyntaxError') {
        return new Result(StatusCodes.BAD_REQUEST, 'You did not send valid JSON')
      } else {
        throw e
      }
    }
    return body
  }

  async saveMedia(srcPath: string): Promise<string> {
    // TO-DO enforce valid media
    const thinkOfPath = function(): string {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let path = ''
      for(let i = 0; i < 32; i++) {
        path += chars[Math.floor(Math.random() * chars.length)]
      }
      return path
    }

    while(true) {
      let somePath = thinkOfPath()
      somePath += path.extname(srcPath).toLowerCase()

      try {
        await fs.copyFile(srcPath, this.config.apiMediaRoot + somePath);
        await fs.rm(srcPath, {recursive: false})
        log.info(`${srcPath} saved as ${somePath}`)
        return somePath // It worked
      } catch (err) {
        if(err instanceof Error && (err as NodeJS.ErrnoException).code === 'EEXIST') {
          log.info(`Media URI collision: ${somePath}`)
          continue
        } else {
          throw err
        }
      }
    }
  }


  // Bejelentkezős endpointok
  async epRegister(call: ApiCall): Promise<Result> {
    if(call.request.method != 'POST') return Api.errorMethodNotAllowed()
    if(call.loggedInAs !== null) {
      return new Result(StatusCodes.BAD_REQUEST, 'You\'re already logged in')
    }

    const body = await this.parseBody(call.request)
    if(body instanceof Result) return body

    if(typeof body.login !== 'string') return Api.errorMissingProp('login (string)')
    if(typeof body.email !== 'string') return Api.errorMissingProp('email (string)')
    if(typeof body.pass !== 'string') return Api.errorMissingProp('pass (string)')

    if(!this.isPasswordGood(body.pass)) return new Result(StatusCodes.BAD_REQUEST, 'Your password doesn\'t meet some requirement')

    let foundUser: User | undefined
    for(const id of this.yieldUserIds(new RegExp('^' + body.login + '$'))) {
      if(foundUser !== undefined) break
      foundUser = await this.userCache.tryGet(id)
    }

    if(foundUser !== undefined && foundUser.name == body.login) {
      return new Result(StatusCodes.BAD_REQUEST, 'A user with this name already exists')
    } else {
      let id = 1
      for(const existingId of this.yieldUserIds(undefined)) {
        if(id <= existingId) id = existingId + 1
      }

      const newUser = new User(
        id,
        {
          name: body.login,
          email: body.email,
          password: this.hashPassword(body.pass, id),
          averageStars: 0,
          bio: "",
          pictureUri: ""
        }
      )
      this.userCache.insert(id, newUser)
      return new Result(StatusCodes.CREATED, 'User created')
    }
  }

  async epAuth(call: ApiCall): Promise<Result> {
    if(call.request.method != 'POST') return Api.errorMethodNotAllowed()
    const giveToken = (user: User) => {
      const token = JSON.stringify(
        {
          'id': user.id,
          'signature': this.getTokenSignature(user)
        }
      )
      call.request.setCookie(this.sessionCookieName, token)
    }

    if(call.loggedInAs !== null) {
      giveToken(call.loggedInAs)
      return new Result(StatusCodes.OK, 'You\'re already logged in')
    }

    const body = await this.parseBody(call.request)
    if(body instanceof Result) return body

    if(typeof body.login !== 'string') return Api.errorMissingProp('login (string)')
    if(typeof body.pass !== 'string') return Api.errorMissingProp('pass (string)')

    let foundUser: User | undefined
    for(const id of this.yieldUserIds(new RegExp('^' + body.login + '$'))) {
      if(foundUser !== undefined) break
      foundUser = await this.userCache.tryGet(id)
    }

    if(foundUser === undefined || foundUser.name != body.login || foundUser.password != this.hashPassword(body.pass, foundUser.id)) {
      log.warn(this.hashPassword(body.pass, foundUser!.id))
      return new Result(StatusCodes.FORBIDDEN, 'Incorrect username or password')
    } else {
      giveToken(foundUser)
      return new Result(StatusCodes.OK, 'Login succesful, enjoy your cookie!')
    }
  }

  async epAuthForm(call: ApiCall): Promise<Result> {
    if(call.request.method != 'GET') return Api.errorMethodNotAllowed()
    // This is stupid
    call.contentType = 'text/html'
    return new Result(StatusCodes.OK,
      "<html><body>\
      <form id=\"form\" method=\"post\" action=\"/api/auth\" accept-charset=\"utf-8\">\
      <label for=\"login\">login</label>\
      <input name=\"login\" id=\"login\" type=\"text\">\
      <label for=\"pass\">pass</label>\
      <input name=\"pass\" id=\"pass\" type=\"password\">\
      <input type=\"submit\">\
      </form>\
      <form id=\"logout\" method=\"post\" action=\"/api/logout\" accept-charset=\"utf-8\">\
      <label for=\"submit\">log out</label>\
      <input name=\"submit\" type=\"submit\">\
      </form>\
      <script>\
        document.getElementById('form').addEventListener('submit', function(event) {\
          event.preventDefault();\
          const formData = new FormData(event.target);\
          const data = Object.fromEntries(formData.entries());\
          const jsonData = JSON.stringify(data);\
          fetch(form.action, {\
              method: form.method,\
              headers: {\
                  'Content-Type': 'application/json'\
              },\
              body: jsonData\
          });\
        });\
      </script>\
      </body></html>"
    )
  }

  async epLogout(call: ApiCall): Promise<Result> {
    if(call.request.method != 'POST') return Api.errorMethodNotAllowed()

    call.request.setCookie(this.sessionCookieName, 'x')

    if(call.loggedInAs !== null) {
      return new Result(StatusCodes.OK, 'Cleared your session cookie')
    } else {
      return new Result(StatusCodes.OK, 'You weren\'t logged in, but cleared your session cookie anyways')
    }
  }


  // Useres endpointok
  async epUserList(call: ApiCall): Promise<Result> {
    if(call.request.method != 'GET') return Api.errorMethodNotAllowed()

    const pagesToTurn: number = Number(call.request.query['page']) ?? 0

    const filter = call.request.query['filter']
    const regex = (typeof filter === 'string') ? RegExp(filter, 'i') : undefined

    const gen = this.yieldUserIds(regex)
    this.skipPages(gen, pagesToTurn)

    const arr = Array.from(gen)

    return new Result(StatusCodes.OK, arr)
  }

  async epUserById(call: ApiCall): Promise<Result> {
    if(!['GET', 'DELETE'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) {
      return new Result(StatusCodes.BAD_REQUEST, 'ID must be an integer')
    }

    const user = await this.userCache.tryGet(id)
    if(user === undefined) {
      return new Result(StatusCodes.NOT_FOUND, 'No user with this ID exists')
    }

    switch(call.request.method) {
      case 'GET': return new Result(StatusCodes.OK, user.serializePublic())
      case 'DELETE': {
        if(call.loggedInAs === null) return Api.errorAuthRequired()
        if(call.loggedInAs?.id !== user.id) return new Result(StatusCodes.FORBIDDEN, 'You can only delete yourself')
        else {
          this.mediaStagers.drop(user.id)
          this.dropUser(user.id)
          this.offerCache.drop(user.id)
          call.request.setCookie(this.sessionCookieName, 'x')
          return new Result(StatusCodes.OK, 'Harakiri successful')
        }
      }
      default: throw new Error('Unreachable')
    }
  }

  async epGetUserSelf(call: ApiCall): Promise<Result> {
    const self: User | null = call.loggedInAs
    if(self !== null) {
      return new Result(StatusCodes.OK, self.serializePublic())
    } else {
      return new Result(StatusCodes.NOT_FOUND, 'Not logged in')
    }
  }

  async epUserBio(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'PUT') return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) {
      return new Result(StatusCodes.BAD_REQUEST, 'ID must be an integer')
    }

    const user = await this.userCache.tryGet(id)
    if(user === undefined) {
      return new Result(StatusCodes.NOT_FOUND, 'No user with this ID exists')
    }

    if(call.loggedInAs === null) return Api.errorAuthRequired()
    if(call.loggedInAs.id !== user.id) return new Result(StatusCodes.FORBIDDEN, 'You can only do this to yourself')

    user.bio = await call.request.readBody()
    return new Result(StatusCodes.OK, 'Profile bio updated')
  }

  async epUserPicture(call: ApiCall): Promise<Result> {
    if(!['POST', 'DELETE'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) {
      return new Result(StatusCodes.BAD_REQUEST, 'ID must be an integer')
    }

    const user = await this.userCache.tryGet(id)
    if(user === undefined) {
      return new Result(StatusCodes.NOT_FOUND, 'No user with this ID exists')
    }

    if(call.loggedInAs === null) return Api.errorAuthRequired()
    if(call.loggedInAs.id !== user.id) return new Result(StatusCodes.FORBIDDEN, 'You can only do this to yourself')

    switch(call.request.method) {
      case 'POST': {
        const imagePath: string | undefined = await call.request.receiveImage()

        if(imagePath === undefined) return new Result(StatusCodes.BAD_REQUEST, 'Image upload failed. You need to send the image as multipart/form-data, in an input named "image"')
        log.info(`Received ${imagePath} from user ${call.loggedInAs.id}`)

        const uri = await this.saveMedia(imagePath)
        user.profilePicUri = uri
        this.userCache.insert(user.id, user)
        return new Result(StatusCodes.OK, 'Profile picture updated')
      }
      case 'DELETE': {
        user.profilePicUri = ''
        this.userCache.insert(user.id, user)
        return new Result(StatusCodes.OK, 'Profile picture removed')
      }
      default: throw new Error('Unreachable')
    }
  }

  async epUserPassword(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'PUT') return Api.errorMethodNotAllowed()

    const body = await this.parseBody(call.request)
    if(body instanceof Result) return body

    if(typeof body.pass !== 'string') return Api.errorMissingProp('pass (string)')

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) {
      return new Result(StatusCodes.BAD_REQUEST, 'ID must be an integer')
    }

    const user = await this.userCache.tryGet(id)
    if(user === undefined) {
      return new Result(StatusCodes.NOT_FOUND, 'No user with this ID exists')
    }

    if(call.loggedInAs === null) return Api.errorAuthRequired()
    if(call.loggedInAs.id !== user.id) return new Result(StatusCodes.FORBIDDEN, 'You can only do this to yourself')

    if(!this.isPasswordGood(body.pass)) return new Result(StatusCodes.BAD_REQUEST, 'Your password doesn\'t meet some requirement')
    user.password = this.hashPassword(body.pass, user.id)
    call.request.setCookie(this.sessionCookieName, 'x')
    return new Result(StatusCodes.OK, 'Password updated, please log in again')
  }


  // Kategóriás endpointok
  async epCategoryList(call: ApiCall): Promise<Result> {
    if(call.request.method != 'GET') return Api.errorMethodNotAllowed()

    const filter = call.request.query['filter']
    const regex = (typeof filter === 'string') ? RegExp(filter, 'i') : undefined

    const gen = this.yieldCategoryIds(regex)

    const arr = Array.from(gen).map((id) => this.fetchCategory(id)?.serializePublic(), this)

    return new Result(StatusCodes.OK, arr)
  }


  // Offeres endpointok
  async epOfferList(call: ApiCall): Promise<Result> {
    if(!['GET', 'POST'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()

    const optionalNum = function(name: string): number | undefined {
      const val = call.request.query[name]
      return (typeof val === 'number') ? val : undefined
    }

    switch(call.request.method) {
      case 'GET': {
        const pagesToTurn: number = Number(call.request.query['page']) ?? 0

        const includeSold: boolean = call.request.query['includeSold'] === 'true'

        const titleFilter = call.request.query['filterTitle']
        const titleRegex = (typeof titleFilter === 'string') ? RegExp(titleFilter, 'i') : undefined
        const categoryId = optionalNum('filterCategory')

        const minPrice = optionalNum('minPrice')
        const maxPrice = optionalNum('maxPrice')

        const gen = this.yieldOfferIds(
          titleRegex,
          categoryId,
          minPrice,
          maxPrice,
          'id',
          false
        )

        const thiis = this // Miért
        this.skipPages<number>(
          function*(): Iterator<number> {
            for(const val of gen) {
              if(includeSold || thiis.fetchOffer(val)?.buyer === null) {
                yield val
              }
            }
          }(), // Genuis!
          pagesToTurn
        )

        const arr = Array.from(gen)

        return new Result(StatusCodes.OK, arr)
      }
      case 'POST': {
        if(call.loggedInAs === null) return Api.errorAuthRequired()
        /*{
          "title": "Hagyományos mosópor kedvező Áron",
          "price": 1000, // Nemnegatív egész szám
          "description": "Természetes okokból elhunyt anyósomtól örökölt, kiváló állapotú, alig használt mosópor.\n\nPlz vegye már meg vki",
          "categoryId": 1, // Hanyadik kategória a /categories-ből
        }*/
        const body = await this.parseBody(call.request)
        if(body instanceof Result) return body

        if(typeof body.title !== 'string') return Api.errorMissingProp('title (string)')
        if(typeof body.price !== 'number') return Api.errorMissingProp('price (number)')
        if(typeof body.description !== 'string') return Api.errorMissingProp('description (string)')
        if(typeof body.categoryId !== 'number') return Api.errorMissingProp('categoryId (number)')

        const category = await this.categoryCache.tryGet(body.categoryId)
        if(category === undefined) return new Result(StatusCodes.BAD_REQUEST, 'Category doesn\'t exist')

        let id = 1
        for(const existingId of this.yieldOfferIds(undefined, undefined, undefined, undefined, 'id', true)) {
          if(id <= existingId) {
            id = existingId + 1
            break // Mert descending.
          }
        }

        const stager = await this.getStager(call.loggedInAs)

        const offer = new Offer(
          id,
          {
            createdTimestamp: Date.now(),
            seller: call.loggedInAs,
            title: body.title,
            category: category,
            description: body.description,
            price: body.price,
            pictureUris: stager.urls
          }
        )

        stager.urls = []

        await this.offerCache.insert(id, offer)
      }
      default: throw new Error('Unreachable')
    }
  }

  async epRandomOffers(call: ApiCall): Promise<Result> {
    if(call.request.method != 'GET') return Api.errorMethodNotAllowed()

    const optionalNum = function(name: string): number | undefined {
      const val = call.request.query[name]
      return (typeof val === 'number') ? val : undefined
    }

    let count = optionalNum('count') ?? 10

    let gen = this.yieldOfferIds(
      undefined,
      undefined,
      undefined,
      undefined,
      'random',
      false
    )

    const arr: number[] = []
    for(const val of gen) {
      if(this.fetchOffer(val)?.buyer === null) {
        arr.push(val)
      }

      count--
      if(count <= 0) break
    }

    return new Result(StatusCodes.OK, arr)
  }

  async epOfferById(call: ApiCall): Promise<Result> {
    if(!['GET', 'DELETE'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) return new Result(StatusCodes.BAD_REQUEST, 'Index must be an integer')

    const offer = await this.offerCache.tryGet(id)
    if(offer === undefined) return new Result(StatusCodes.NOT_FOUND, 'No offer with this ID exists')

    switch(call.request.method) {
      case 'GET': {
        return new Result(StatusCodes.OK, offer.serializePublic())
      }
      case 'DELETE': {
        if(call.loggedInAs === null) return Api.errorAuthRequired()

        if(offer.seller.id !== call.loggedInAs.id) return new Result(StatusCodes.FORBIDDEN, 'You can only do this to your own offers')
        if(offer.buyer !== null) return new Result(StatusCodes.FORBIDDEN, 'This offer is already sold')

        this.dropOffer(offer.id)
        await this.offerCache.drop(offer.id)

        return new Result(StatusCodes.OK, 'Offer deleted')
      }
      default: throw new Error('Unreachable')
    }
  }

  async epOfferBuy(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'POST') return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) return new Result(StatusCodes.BAD_REQUEST, 'Index must be an integer')

    const offer = await this.offerCache.tryGet(id)
    if(offer === undefined) return new Result(StatusCodes.NOT_FOUND, 'No offer with this ID exists')

    if(call.loggedInAs === null) return Api.errorAuthRequired()

    if(offer.seller.id === call.loggedInAs.id) return new Result(StatusCodes.FORBIDDEN, 'You can\'t buy your own offer')
    if(offer.buyer !== null) return new Result(StatusCodes.FORBIDDEN, 'This offer is already sold')

    offer.buyer = call.loggedInAs
    offer.entangle(offer.buyer)
    offer.entangle(offer.seller)

    return new Result(StatusCodes.OK, 'Purchased')
  }

  async epOfferRating(call: ApiCall): Promise<Result> {
    if(!['GET', 'POST'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()

    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) return new Result(StatusCodes.BAD_REQUEST, 'Index must be an integer')

    const offer = await this.offerCache.tryGet(id)
    if(offer === undefined) return new Result(StatusCodes.NOT_FOUND, 'No offer with this ID exists')

    switch(call.request.method) {
      case 'GET': {
        if(offer.buyerRating !== null) return new Result(StatusCodes.OK, { stars: offer.buyerRating })
        else return new Result(StatusCodes.NOT_FOUND, 'Not rated yet')
      }
      case 'POST': {
        if(call.loggedInAs === null) return Api.errorAuthRequired()

        if(offer.buyer === null) return new Result(StatusCodes.FORBIDDEN, 'This offer is not sold yet')
        if(offer.buyer.id !== call.loggedInAs.id) return new Result(StatusCodes.FORBIDDEN, 'You can only rate offers that you bought')
        if(offer.buyerRating !== null) return new Result(StatusCodes.FORBIDDEN, 'This offer was already rated')

        const body = await this.parseBody(call.request)
        if(body instanceof Result) return body
        if(typeof body.stars !== 'number') return Api.errorMissingProp('stars (number)')

        offer.buyerRating = body.stars
        offer.entangle(offer.buyer)
        offer.entangle(offer.seller)
      }
      default: throw new Error('Unreachable')
    }
  }


  // Media stager
  async epMediaStagerForm(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'GET') return Api.errorMethodNotAllowed()
    call.contentType = 'text/html'
    return new Result(StatusCodes.OK, '<html><body><form action="/api/mediastager" method="POST" enctype="multipart/form-data"><input type="file" id="image" name="image" accept="image/*" required><button type="submit">Submit</button></form></body></html>')
  }

  async epMediaStager(call: ApiCall): Promise<Result> {
    if(!['GET', 'POST', 'DELETE'].includes(call.request.method ?? '')) return Api.errorMethodNotAllowed()
    if(call.loggedInAs === null) return Api.errorAuthRequired()

    const stager = await this.getStager(call.loggedInAs)

    switch(call.request.method) {
      case 'GET': {
        return new Result(
          StatusCodes.OK,
          {
            imagesLeft: stager.capacity - stager.urls.length,
            uris: stager.urls
          }
        )
      }

      case 'POST': {
        if(stager.urls.length >= stager.capacity) return new Result(StatusCodes.BAD_REQUEST, 'Media stager is full')
        const imagePath: string | undefined = await call.request.receiveImage()

        if(imagePath === undefined) return new Result(StatusCodes.BAD_REQUEST, 'Image upload failed. You need to send the image as multipart/form-data, in an input named "image"')
        log.info(`Received ${imagePath} from user ${call.loggedInAs.id}`)

        const uri = await this.saveMedia(imagePath)

        stager.urls.push(uri)
        return new Result(StatusCodes.OK, 'Upload succesful')
      }

      case 'DELETE': {
        stager.urls = []
        return new Result(StatusCodes.OK, 'Media stager cleared')
      }

      default: throw new Error('Unreachable')
    }
  }

  async epMediaStagerIndexed(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'DELETE') return Api.errorMethodNotAllowed()
    if(call.loggedInAs === null) return Api.errorAuthRequired()

    const index = Number(call.variables[0])
    if(!Number.isSafeInteger(index)) {
      return new Result(StatusCodes.BAD_REQUEST, 'Index must be an integer')
    }

    const stager = await this.getStager(call.loggedInAs)

    if(index < 0 || index >= stager.urls.length) return new Result(StatusCodes.BAD_REQUEST, 'Index out of range')

    const newUrls: string[] = []
    for(let i = 0; i < stager.urls.length; i++) {
      if(i !== index) newUrls.push(stager.urls[i])
    }

    stager.urls = newUrls

    return new Result(StatusCodes.OK, 'Deleted')
  }


  async epMedia(call: ApiCall): Promise<Result> {
    if(call.request.method !== 'GET') return Api.errorMethodNotAllowed()

    const uri = call.variables[0]
    if(uri.includes('/')) return new Result(StatusCodes.BAD_REQUEST, 'Invalid uri')

    const path = this.config.apiMediaRoot + uri

    let file: fs.FileHandle | undefined = undefined
    try {
      const mimeType: string = Mime.getType(path) || 'application/octet-stream'
      file = await fs.open(path, 'r')

      await call.request.sendFile(file, mimeType)
      return new Result(StatusCodes.OK, undefined)
    } catch(error) {
      if(error instanceof Error) {
        switch((error as NodeJS.ErrnoException).code) {
          case 'ENOENT':
          case 'ERR_FS_EISDIR':
            return new Result(StatusCodes.NOT_FOUND, 'Not found')
        }
      }
      throw error
    } finally {
      if(file !== undefined) await file.close()
    }
  }


  /**
    Visszaadja növekvő sorrendben az összes megfelelő User id-jét.
    @param nameRegex Azokra szűkíti, akik felhasználónevére matchel ez a regex.
  **/
  abstract yieldUserIds(
    nameRegex: RegExp | undefined
  ): Generator<number>
  /**
    Visszaadja a megadott id-jű Usert, vagy undefinedet, ha nem létezik.
  **/
  abstract fetchUser(id: number): User | undefined
  /**
    Eltárol egy Usert.
  **/
  abstract commitUser(val: User): void
  /**
    Töröl egy Usert.
  **/
  abstract dropUser(id: number): void

  /**
    Visszaadja az összes Offer id-jét.
    @param titleRegex Azokra szűkíti, melyek címére matchel ez a regex.
    @param categoryFilter Azokra szűkíti, melyek kategóriája ez.
    @param minPrice Azokra szűkíti, melyeknek ára legalább ennyi.
    @param maxPrice Azokra szűkíti, melyeknek ára legfeljebb ennyi.
    @param orderBy Megadja a rendezés szempontját.
    @param descending Ha ez igaz, akkor csökkenő a sorrend, különben növekvő. Random rendezési szempontnál nem számít.
  **/
  abstract yieldOfferIds(
    titleRegex: RegExp | undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number>
  /**
    Visszaadja a megadott id-jű Offert, vagy undefinedet, ha nem létezik.
  **/
  abstract fetchOffer(id: number): Offer | undefined
  /**
    Eltárol egy Offert.
  **/
  abstract commitOffer(val: Offer): void
  /**
    Töröl egy Offert.
  **/
  abstract dropOffer(id: number): void

  /**
    Visszaadja az összes Category id-jét.
    @param nameRegex Azokra szűkíti, melyek nevére matchel ez a regex.
  **/
  abstract yieldCategoryIds(
    nameRegex: RegExp | undefined
  ): Generator<number>
  /**
    Visszaadja a megadott id-jű Categoryt, vagy undefinedet, ha nem létezik.
  **/
  abstract fetchCategory(id: number): Category | undefined
  /**
    Eltárol egy Categoryt.
  **/
  abstract commitCategory(val: Category): void
  /**
    Töröl egy Categoryt.
  **/
  abstract dropCategory(id: number): void

  /**
    Visszaad minden olyan URL-t, mely nem szerepel User profilképeként, vagy Offer képei közt.
  **/
  abstract yieldUnusedMediaUrls(): Generator<string>

}
