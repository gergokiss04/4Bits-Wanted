import { Api } from '../api.js'
import { User, Offer, Category } from '../records.js';


/**
  Minden adatot a memóriában tárol.
**/
export class MemoryApi extends Api {

  logCallback?: (msg: string) => void
  log(msg: string) {
    if(this.logCallback) this.logCallback(msg)
  }

  users = new Map<number, User>()
  offers = new Map<number, Offer>()
  categories = new Map<number, Category>()


  loadTestData() {
    this.users.set(1,
      new User(1,
        {
          name: 'bob',
          password: '3c200ffd1c7a231c07431c118f2f37eed9504c88111a885dbdf6207ce1c98547',
          averageStars: 2.5,
          bio: "Hi!\n\nI'm Bob.\n<script>alert(1)</script>(btw my password is 123)",
          pictureUri: ""
        }
      )
    )
    this.users.set(3,
      new User(3,
        {
          name: 'asd123',
          password: 'not valid hex >:)',
          averageStars: 0.0,
          bio: "",
          pictureUri: ""
        }
      )
    )
  }

  override *yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    this.log('Yield user IDs')
    for(const kvp of this.users) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      yield kvp[0]
    }
  }

  override fetchUser(id: number): User | undefined {
    this.log(`Fetch user ${id}`)
    return this.users.get(id)
  }

  override commitUser(val: User): void {
    this.log(`Commit user ${val.id}`)
    this.users.set(val.id, val)
  }

  override dropUser(id: number): void {
    this.log(`Drop user ${id}`)
    this.users.delete(id)
  }


  override *yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number> {
    this.log('Yield offer IDs')

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

  override fetchOffer(id: number): Offer | undefined {
    this.log(`Fetch offer ${id}`)
    return this.offers.get(id)
  }

  override commitOffer(val: Offer): void {
    this.log(`Commit offer ${val.id}`)
    this.offers.set(val.id, val)
  }

  override dropOffer(id: number): void {
    this.log(`Drop offer ${id}`)
    this.offers.delete(id)
  }


  override *yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    this.log('Yield category IDs')
    for(const kvp of this.categories) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      yield kvp[0]
    }
  }

  override fetchCategory(id: number): Category | undefined {
    this.log(`Fetch category ${id}`)
    return this.categories.get(id)
  }

  override commitCategory(val: Category): void {
    this.log(`Commit category ${val.id}`)
    this.categories.set(val.id, val)
  }

  override dropCategory(id: number): void {
    this.log(`Drop category ${id}`)
    this.categories.delete(id)
  }


  override *yieldUnusedMediaUrls(): Generator<string> {
    this.log(`Yield unused media URLs`)
    // TODO
    throw new Error('Not implemented')
  }

}
