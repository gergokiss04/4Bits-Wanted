import http from 'http'
import { StatusCodes } from 'http-status-codes'

import * as log from './log.js'
import { Request } from './main.js'
import { Cache } from './cache.js'
import { User, Offer, Category, Record } from './records.js'


class ApiCall {

  request: Request
  variables: string[]

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

  userCache = new Cache<number, User>()
  offerCache = new Cache<number, Offer>()
  categoryCache = new Cache<number, Category>()

  endpoints: Array<Endpoint> = Array()
  reportErrors = true // TODO konfigurálható


  constructor() {
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

    this.addEndpoint(['users'], this.getUsers)
    this.addEndpoint(['users', '$'], this.getUser)
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


  async getUsers(call: ApiCall): Promise<Result> {
    const pagesToTurn: number = Number(call.request.query['page']) ?? 0

    const filter = call.request.query['filter']
    const regex = (typeof filter === 'string') ? RegExp(filter, 'i') : undefined

    const gen = this.yieldUserIds(regex)
    this.skipPages(gen, pagesToTurn)

    const arr = Array.from(gen)

    return new Result(StatusCodes.OK, arr)
  }

  async getUser(call: ApiCall): Promise<Result> {
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
