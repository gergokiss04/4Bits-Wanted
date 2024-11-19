import * as dictutil from './dictutil.js'
import { Mutex, Semaphore, SemaphoreInterface } from 'async-mutex'




export class Cache<TKey, TValue> {

  /*
    Gyakorlatilag bármennyi olvasót engedélyez, de az íroknak meg kell enniük az egészet egyszerre.
  */
  static readonly BIG_LIMIT = 4096
  static readonly WRITE_PRIORITY = 1 // A read priority mindig 0. A nagyobb magasabb.

  expireSeconds: number = 120
  maxElements: number = 256
  dict: Map<TKey, {timestamp: bigint, value: TValue}> = new Map()
  semaphore = new Semaphore(Cache.BIG_LIMIT)


  static now(): bigint {
    return process.hrtime.bigint()
  }

  static elapsedSeconds(from: bigint, till: bigint): number {
    return Number((till - from) / 1_000_000_000n)
  }


  runExclusiveRead<T>(callback: SemaphoreInterface.Worker<T>): Promise<T> {
    return this.semaphore.runExclusive(callback, 1)
  }

  runExclusiveWrite<T>(callback: SemaphoreInterface.Worker<T>): Promise<T> {
    return this.semaphore.runExclusive(callback, Cache.BIG_LIMIT, Cache.WRITE_PRIORITY)
  }

  public async insert(key: TKey, value: TValue) {
    await this.runExclusiveWrite(
      () => {
        // Ha túl sok van, kezdd el kidobálni a régieket
        if(this.dict.size >= this.maxElements) {
          for(const key of this.dict.keys()) {
            console.log(`${key} -> ${this.dict.get(key)?.value} dropped`) // HACK
            this.dict.delete(key) // Genuis! Elvileg insertion order szerint adja vissza a keys().
            if(this.dict.size < this.maxElements) break
          }
        }

        this.dict.set(key, { timestamp: Cache.now(), value: value })
      }
    )
  }

  public async tryGet(key: TKey) : Promise<TValue | undefined> {
    return await this.runExclusiveRead(
      () => {
        return this.dict.get(key)?.value
      }
    )
  }

  public async garbicCollect() {
    await this.runExclusiveWrite(
      () => {
        const now = Cache.now()

        let expired: Array<TKey> = []

        for(const key of this.dict.keys()) {
          const valWithTime = this.dict.get(key)
          if(!valWithTime) throw new Error()

          if(Cache.elapsedSeconds(valWithTime.timestamp, now) > this.expireSeconds) {
            console.log(`${key} -> ${valWithTime.value} expired`) // HACK
            expired.push(key)
          }
        }

        for(const expiredKey of expired) {
          if(!this.dict.delete(expiredKey)) throw new Error()
        }
      }
    )
  }

  public setGcInterval() {
    setTimeout(
      () => {
        this.garbicCollect()
        this.setGcInterval()
      },
      this.expireSeconds / 2
    )
  }

}


export abstract class Record<TId> {

  id: TId

  constructor(id: TId) {
    this.id = id
  }

  /**
    Konformálnia kell az api.md-hez.
  **/
  abstract serializePublic(): string

}


// A getInstancék csak azért létezhetnek, mert elvileg nem létezhet körkörös/nagyon nagy referenciahálózat!

export class User extends Record<number> {

  static instances: {[key: number]: User}

  public static getInstance(id: number): User {
    // TODO
    throw new Error("Method not implemented.")
  }


  id: number
  name: string
  password: string
  averageRating: number
  bio: string
  profilePicUri: string


  constructor(id: number, dict: {}) {
    super(id)

    this.id = dictutil.require(dict, ['id'])
    this.name = dictutil.require(dict, ['name'])
    this.password = dictutil.require(dict, ['password'])
    this.averageRating = dictutil.require(dict, ['averageStars'])
    this.bio = dictutil.require(dict, ['bio'])
    this.profilePicUri = dictutil.require(dict, ['pictureUri'])
  }


  serializePublic(): string {
    return JSON.stringify(
      {
        id: this.id,
        name: this.name,
        averageStars: this.averageRating,
        bio: this.bio,
        pictureUri: this.profilePicUri
      }
    )
  }

}

export class Offer extends Record<number> {

  static instances: {[key: number]: Offer}

  public static getInstance(id: number): Offer {
    // TODO
    throw new Error("Method not implemented.")
  }


  createdTimestamp: number
  seller: User
  title: string
  category: Category
  description: string
  price: number
  pictureUris: string[]
  buyer: User | null
  soldTimestamp: number | null
  buyerRating: number | null


  constructor(id: number, dict: {}) {
    super(id)

    this.createdTimestamp = dictutil.require<number>(dict, ['created'])
    this.seller = User.getInstance(dictutil.require<number>(dict, ['sellerId']))
    this.title = dictutil.require(dict, ['title'])
    this.category = Category.getInstance(dictutil.require<number>(dict, ['categoryId']))
    this.description = dictutil.require(dict, ['description'])
    this.price = dictutil.require(dict, ['price'])
    this.pictureUris = dictutil.require(dict, ['pictureUris'])
    const buyerId: number = dictutil.require(dict, ['buyerId'])
    this.buyer = buyerId ? User.getInstance(buyerId) : null
    this.soldTimestamp = dictutil.require<number>(dict, ['sold'])
    this.buyerRating = dictutil.optional(dict, ['buyerRating'])
  }


  serializePublic(): string {
    return JSON.stringify(
      {
        id: this.id,
        created: this.createdTimestamp,
        title: this.title,
        sellerId: this.seller.id,
        buyerId: this.buyer?.id,
        sold: this.soldTimestamp,
        price: this.price,
        description: this.description,
        categoryId: this.category.id,
        pictureUris: this.pictureUris
      }
    )
  }

}

export class Category extends Record<number> {

  static instances: {[key: number]: Category}

  public static getInstance(id: number): Category {
    // TODO
    throw new Error("Method not implemented.")
  }


  name: string


  constructor(id: number, dict: {}) {
    super(id)

    this.name = dictutil.require(dict, ['name'])
  }


  serializePublic(): string {
    return JSON.stringify(
      {
        id: this.id,
        name: this.name
      }
    )
  }

}
