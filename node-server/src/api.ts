import http from 'http'
import { StatusCodes } from 'http-status-codes'
import * as log from './log.js'
import { User, Offer, Category, Record } from './records.js'


class ApiCall {

  req: http.IncomingMessage
  res: http.ServerResponse<http.IncomingMessage>
  variables: string[]

  constructor(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, variables: string[]) {
    this.req = req
    this.res = res
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

  async writePatiently(res: http.ServerResponse<http.IncomingMessage>, chunk: any) : Promise<void> {
    // TODO ez jelzi a hibát ha nincs callbackje?
    const wrote: boolean = res.write(chunk)
    if(!wrote) await new Promise(resolve => res.once('drain', resolve))
  }


  async handle(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, path: string[]): Promise<void> {

    // Megkeressük, melyik endpoint útvonala illeszkedik a kérés útvonalával
    let matchedEndpoint: Endpoint | null = null
    for(let endpoint of this.endpoints) {
      if(endpoint.path.length != path.length) continue

      let good = true
      for(let i in endpoint.path) {
        if(endpoint.path[i] != '$' && path[i] != endpoint.path[i]) {
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
          variables.push(path[i])
          break
        }
      }

      const call = new ApiCall(req, res, variables)
      try {
        const result = await matchedEndpoint.method(call)
        res.statusCode = result.code
        if(result.body !== undefined) await this.writePatiently(res, JSON.stringify(result.body))
      } catch(e) {
        res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        if(this.reportErrors) await this.writePatiently(res, JSON.stringify(e))
      }

    } else {
      log.info(`No suitable API endpoint for ${log.sanitize(path)}`)
      res.statusCode = StatusCodes.NOT_FOUND
      await this.writePatiently(res, 'No such API endpoint.')
    }

    res.end()
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
