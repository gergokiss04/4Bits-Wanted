import http from 'http'
import { User, Offer, Category, Record } from './records.js'


export abstract class Api {

  constructor() {
    // do nothing
  }

  async handle(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, path: string[]): Promise<void> {
    res.statusCode = 404
    res.end()
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
