import { Api } from '../api.js'
import { User, Offer, Category } from '../records.js';


/**
  Minden adatot a memóriában tárol.
**/
export class MemoryApi extends Api {

  users = new Map<number, User>()
  offers = new Map<number, Offer>()
  categories = new Map<number, Category>()


  ;*yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    for(const kvp of this.users) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      yield kvp[0]
    }
  }

  fetchUser(id: number): User | undefined {
    return this.users.get(id)
  }

  commitUser(val: User): void {
    this.users.set(val.id, val)
  }

  dropUser(id: number): void {
    this.users.delete(id)
  }


  ;*yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number> {
    let copy: Offer[] = []
    for(const kvp of this.offers) {
      copy.push(kvp[1])
    }

    if(orderBy === 'id') {
      copy.sort((a, b) => a.id - b.id)
    } else if(orderBy === 'price') {
      copy.sort((a, b) => a.price - b.price)
    } else if(orderBy === 'random') {
      for(let i = 0; i < copy.length; i++) {
        const tmp = copy[i]
        const other = i + Math.floor(Math.random() * (copy.length - i))
        copy[i] = copy[other]
        copy[other] = tmp
      }
    }

    if(descending) copy.reverse()

    for(let i = 0; i < copy.length; i++) {
      const kvp: [number, Offer] = [i, copy[i]]

      if(titleRegex && !titleRegex.test(kvp[1].title)) continue
      if(categoryFilter && kvp[1].category.id !== categoryFilter) continue
      if(minPrice && kvp[1].price < minPrice) continue
      if(maxPrice && kvp[1].price > maxPrice) continue
      yield kvp[0]
    }
  }

  fetchOffer(id: number): Offer | undefined {
    return this.offers.get(id)
  }

  commitOffer(val: Offer): void {
    this.offers.set(val.id, val)
  }

  dropOffer(id: number): void {
    this.offers.delete(id)
  }


  ;*yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    for(const kvp of this.categories) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      yield kvp[0]
    }
  }

  fetchCategory(id: number): Category | undefined {
    return this.categories.get(id)
  }

  commitCategory(val: Category): void {
    this.categories.set(val.id, val)
  }

  dropCategory(id: number): void {
    this.categories.delete(id)
  }


  ;*yieldUnusedMediaUrls(): Generator<string> {
    // TODO
  }



}
