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
          email: 'bob@example.com',
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
          email: 'asd@example.com',
          password: 'not valid hex >:)',
          averageStars: 0.0,
          bio: "",
          pictureUri: "abc123placeholder.jpg"
        }
      )
    )
    this.users.set(4,
      new User(4,
        {
          name: 'négyeske',
          email: '4@example.com',
          password: '',
          averageStars: 0.0,
          bio: "I don't share my password with anyone, except bob.",
          pictureUri: "abc123placeholder.jpg"
        }
      )
    )

    this.categories.set(1, new Category(1, {name: 'Ez'}))
    this.categories.set(2, new Category(2, {name: 'Az'}))
    this.categories.set(3, new Category(3, {name: 'Amaz'}))
  }

  override yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Promise<number[]> {
    this.log('Yield user IDs')

    const result: number[] = []

    for(const kvp of this.users) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      result.push(kvp[0])
    }

    return new Promise(() => result)
  }

  override fetchUser(id: number): Promise<User | undefined> {
    this.log(`Fetch user ${id}`)
    return new Promise(() => this.users.get(id))
  }

  override commitUser(val: User): Promise<void> {
    this.log(`Commit user ${val.id}`)
    this.users.set(val.id, val)
    return new Promise(() => undefined)
  }

  override dropUser(id: number): Promise<void> {
    this.log(`Drop user ${id}`)
    this.users.delete(id)
    return new Promise(() => undefined)
  }


  override yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Promise<number[]> {
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

    const ids: number[] = []
    for(let i = 0; i < copy.length; i++) {
      const kvp: [number, Offer] = [i, copy[i]]

      if(titleRegex && !titleRegex.test(kvp[1].title)) continue
      if(categoryFilter && kvp[1].category.id !== categoryFilter) continue
      if(minPrice && kvp[1].price < minPrice) continue
      if(maxPrice && kvp[1].price > maxPrice) continue
      ids.push(kvp[0])
    }

    return new Promise(() => ids)
  }

  override fetchOffer(id: number): Promise<Offer | undefined> {
    this.log(`Fetch offer ${id}`)
    return new Promise(() => this.offers.get(id))
  }

  override commitOffer(val: Offer): Promise<void> {
    this.log(`Commit offer ${val.id}`)
    this.offers.set(val.id, val)
    return new Promise(() => undefined)
  }

  override dropOffer(id: number): Promise<void> {
    this.log(`Drop offer ${id}`)
    this.offers.delete(id)
    return new Promise(() => undefined)
  }


  override yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Promise<number[]> {
    this.log('Yield category IDs')
    const filtered: number[] = []
    for(const kvp of this.categories) {
      if(nameRegex && !nameRegex.test(kvp[1].name)) continue
      filtered.push(kvp[0])
    }
    return new Promise(() => filtered)
  }

  override fetchCategory(id: number): Promise<Category | undefined> {
    this.log(`Fetch category ${id}`)
    return new Promise(() => this.categories.get(id))
  }

  override commitCategory(val: Category): Promise<void> {
    this.log(`Commit category ${val.id}`)
    this.categories.set(val.id, val)
    return new Promise(() => undefined)
  }

  override dropCategory(id: number): Promise<void> {
    this.log(`Drop category ${id}`)
    this.categories.delete(id)
    return new Promise(() => undefined)
  }


  override isMediaUriUsed(): Promise<boolean> {
    this.log(`Is media URI used (not implemented!)`)

    // TODO
    return new Promise(() => true)
  }

}
