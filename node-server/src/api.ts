import http from 'http'
import * as crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'

import * as log from './log.js'
import { Request } from './main.js'
import { Cache } from './cache.js'
import { User, Offer, Category, Record } from './records.js'


class ApiCall {

  request: Request
  variables: string[]
  loggedInAs: User | null = null

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


export abstract class Api {

  private readonly secret: string

  userCache = new Cache<number, User>()
  offerCache = new Cache<number, Offer>()
  categoryCache = new Cache<number, Category>()

  endpoints: Array<Endpoint> = Array()
  reportErrors = true // TODO konfigurálható

  allowDebt = false


  constructor(secret: string) {
    this.secret = secret

    this.userCache.populateCallback = this.fetchUser.bind(this)
    this.userCache.onDroppedCallback = (_, value: User) => { this.commitUser(value); value.dropEntangled(this.userCache) }
    this.userCache.expireSeconds = 1
    this.userCache.setGcInterval()

    this.offerCache.populateCallback = this.fetchOffer.bind(this)
    this.offerCache.onDroppedCallback = (_, value: Offer) => value.dropEntangled(this.offerCache)
    this.offerCache.setGcInterval()

    this.categoryCache.populateCallback = this.fetchCategory.bind(this)
    this.categoryCache.onDroppedCallback = (_, value: Category) => value.dropEntangled(this.categoryCache)
    this.categoryCache.setGcInterval()

    this.addEndpoint(['users'], this.epUserList)
    this.addEndpoint(['users', '$'], this.epGetUser)
    this.addEndpoint(['auth'], this.epAuth)
    this.addEndpoint(['whoami'], this.epWhoAmI)
  }


  addEndpoint(path: string[], method: ApiMethod) {
    this.endpoints.push({path, method})
  }


  async handle(request: Request, apiPath: string[]): Promise<void> {

    // Megkeressük, melyik endpoint útvonala illeszkedik a kérés útvonalával
    let matchedEndpoint: Endpoint | null = null
    for(let endpoint of this.endpoints) {
      if(endpoint.path.length != apiPath.length) continue

      let good = true
      for(let i in endpoint.path) {
        if(endpoint.path[i] != '$' && apiPath[i] != endpoint.path[i]) {
          good = false
          break
        }
      }

      if(good) {
        matchedEndpoint = endpoint
        break
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
        const cookieString = request.req.headers.cookie
        console.log(cookieString) // HACK
        if(typeof cookieString === 'string' && cookieString.length > 1) {
          if((typeof cookieString) !== 'string') throw new Error()
          const cookie = JSON.parse(cookieString as string)
          const forUser: User | undefined = await this.userCache.tryGet(cookie['id'])
          if(forUser !== undefined && this.isSignatureValid(forUser, cookie['signature'])) {
            call.loggedInAs = forUser
          }
        }
      } catch(e) {
        request.res.appendHeader('Set-Cookie', 'x')
        log.info('Client sent cookie with invalid JSON')
      }

      try {
        const bound = matchedEndpoint.method.bind(this)
        const result = await bound(call)
        request.res.statusCode = result.code
        if(result.body !== undefined) await request.writePatiently(JSON.stringify(result.body))
      } catch(e) {
        let msg = `Unhandled exception during API call: ${e}`
        if(e instanceof Error) msg += `\n${e.stack}`;
        log.error(msg)

        request.res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        if(this.reportErrors) await request.writePatiently(JSON.stringify(e))
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

  errorMissingProp(name: string): Result {
    return new Result(StatusCodes.BAD_REQUEST, `Missing required property "${name}"`)
  }

  hashPassword(pass: string, salt: number): string {
    return crypto.createHash('sha256' /* TODO konfigurálható */)
    .update(this.secret)
    .update(salt.toString())
    .update(pass)
    .digest('hex')
  }

  getTokenSignature(user: User): string {
    return crypto.createHash('sha256')
    .update(this.secret)
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


  async epUserList(call: ApiCall): Promise<Result> {
    const pagesToTurn: number = Number(call.request.query['page']) ?? 0

    const filter = call.request.query['filter']
    const regex = (typeof filter === 'string') ? RegExp(filter, 'i') : undefined

    const gen = this.yieldUserIds(regex)
    this.skipPages(gen, pagesToTurn)

    const arr = Array.from(gen)

    return new Result(StatusCodes.OK, arr)
  }

  async epGetUser(call: ApiCall): Promise<Result> {
    const id = Number(call.variables[0])
    if(!Number.isSafeInteger(id)) {
      return new Result(StatusCodes.BAD_REQUEST, 'ID must be an integer')
    }

    const user = await this.userCache.tryGet(id)
    if(user === undefined) {
      return new Result(StatusCodes.NOT_FOUND, 'No user with this ID exists')
    }

    return new Result(StatusCodes.OK, user.serializePublic())
  }

  async epAuth(call: ApiCall): Promise<Result> {
    const body = JSON.parse(await call.request.readBody())

    if(typeof body.login !== 'string') return this.errorMissingProp('login (string)')
    if(typeof body.pass !== 'string') return this.errorMissingProp('pass (string)')

    let foundUser: User | undefined
    for(const id of this.yieldUserIds(new RegExp('^' + body.login + '$'))) {
      if(foundUser !== undefined) break
      foundUser = await this.userCache.tryGet(id)
    }

    if(foundUser === undefined || foundUser.password != this.hashPassword(body.pass, foundUser.id)) {
      //console.log(this.hashPassword(body.pass, foundUser!.id))
      return new Result(StatusCodes.FORBIDDEN, 'Incorrect username or password')
    } else {
      const token = JSON.stringify(
        {
          'id': foundUser.id,
          'signature': this.getTokenSignature(foundUser)
        }
      )
      //call.request.res.setHeader('Set-Cookie', `key=${token}; Domain=127.0.0.1;`) // TODO domain
      call.request.res.setHeader('Set-Cookie', "sessionId=abcd")

      return new Result(StatusCodes.OK, 'Login succesful, enjoy your cookie!')
    }
  }

  async epWhoAmI(call: ApiCall): Promise<Result> {
    return new Result(StatusCodes.IM_A_TEAPOT, call.loggedInAs?.name ?? 'not logged in')
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
