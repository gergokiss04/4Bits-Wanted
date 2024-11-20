import { Api } from '../api.js'
import { User, Offer, Category } from '../records.js';


/**
  Az adatbázisban tárolja az adatokat.
**/
export class DatabaseApi extends Api {

  ;*yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  fetchUser(id: number): User | undefined {
    throw new Error('Not implemented.') // TODO
  }

  commitUser(val: User): void {
    throw new Error('Not implemented.') // TODO
  }

  dropUser(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  ;*yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  fetchOffer(id: number): Offer | undefined {
    throw new Error('Not implemented.') // TODO
  }

  commitOffer(val: Offer): void {
    throw new Error('Not implemented.') // TODO
  }

  dropOffer(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  ;*yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    throw new Error('Not implemented.') // TODO
  }

  fetchCategory(id: number): Category | undefined {
    throw new Error('Not implemented.') // TODO
  }

  commitCategory(val: Category): void {
    throw new Error('Not implemented.') // TODO
  }

  dropCategory(id: number): void {
    throw new Error('Not implemented.') // TODO
  }


  ;*yieldUnusedMediaUrls(): Generator<string> {
    throw new Error('Not implemented.') // TODO
  }

}
