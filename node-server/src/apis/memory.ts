import { Api } from '../api.js'
import { User, Offer, Category } from '../records.js';


/**
  Minden adatot a memóriában tárol.
**/
export class MemoryApi extends Api {

  users = new Map<number, User>()
  offers = new Map<number, Offer>()
  categories = new Map<number, Category>()


  fetchUser(id: number): User | undefined {
    return this.users.get(id)
  }

  commitUser(val: User): void {
    this.users.set(val.id, val)
  }

  dropUser(val: User): void {
    this.users.delete(val.id)
  }


  fetchOffer(id: number): Offer | undefined {
    return this.offers.get(id)
  }

  commitOffer(val: Offer): void {
    this.offers.set(val.id, val)
  }

  dropOffer(val: Offer): void {
    this.offers.delete(val.id)
  }


  fetchCategory(id: number): Category | undefined {
    return this.categories.get(id)
  }

  commitCategory(val: Category): void {
    this.categories.set(val.id, val)
  }

  dropCategory(val: Category): void {
    this.categories.delete(val.id)
  }

}
