import http from 'http'
import { StatusCodes } from 'http-status-codes'

import * as log from './log.js'
import { Request } from './main.js'
import { User, Offer, Category, Record } from './records.js'


class ApiCall {

  request: Request
  variables: string[]

  constructor(request: Request, variables: string[]) {
    this.request = request
    this.variables = variables
  }

}


type Result = {code: StatusCodes, body: any | null}
type ApiMethod = (call: ApiCall) => Promise<Result>
type Endpoint = {path: string[], method: ApiMethod}


export abstract class Api {

  endpoints: Array<Endpoint> = Array()
  reportErrors = true // TODO konfigurálható


  constructor() {
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
        const result = await matchedEndpoint.method(call)
        request.res.statusCode = result.code
        if(result.body !== undefined) await request.writePatiently(JSON.stringify(result.body))
      } catch(e) {
        request.res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        if(this.reportErrors) await request.writePatiently(JSON.stringify(e))
      }

    } else {
      log.info(`No suitable API endpoint for ${log.sanitize(apiPath)}`)
      request.res.statusCode = StatusCodes.NOT_FOUND
      await request.writePatiently('No such API endpoint.')
    }

    request.res.end()
  }


  async getUsers(call: ApiCall): Promise<Result> {
    // HACK
    return {
      code: StatusCodes.OK,
      body: [149]
    }
  }

  async getUser(call: ApiCall): Promise<Result> {
    // HACK
    return {
      code: StatusCodes.OK,
      body: call.variables
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
