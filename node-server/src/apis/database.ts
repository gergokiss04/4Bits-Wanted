import { Api } from '../api.js'
import { User, Offer, Category } from '../records.js';


/**
  Az adatbázisban tárolja az adatokat.
**/
export class DatabaseApi extends Api {

  override *yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  override fetchUser(id: number): User | undefined {
    throw new Error('Not implemented.') // TODO
  }

  override commitUser(val: User): void {
    throw new Error('Not implemented.') // TODO
  }

  override dropUser(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  override *yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  override fetchOffer(id: number): Offer | undefined {
    throw new Error('Not implemented.') // TODO
  }

  override commitOffer(val: Offer): void {
    throw new Error('Not implemented.') // TODO
  }

  override dropOffer(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  override *yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  override fetchCategory(id: number): Category | undefined {
    throw new Error('Not implemented.') // TODO
  }

  override commitCategory(val: Category): void {
    throw new Error('Not implemented.') // TODO
  }

  override dropCategory(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  override *yieldUnusedMediaUrls(): Generator<string> {
    throw new Error('Not implemented.') // TODO
  }

}
