import * as dictutil from './dictutil.js'



type RecordResolver<TId, TRecord extends Record<TId>> = (id: TId) => TRecord

export abstract class Record<TId> {

  readonly id: TId
  readonly entangled = new Set<Record<any>>()

  constructor(id: TId) {
    this.id = id
  }

  /**
    Konformálnia kell az api.md-hez.
  **/
  abstract serializePublic(): string

  public entangle(other: Record<any>) {
    this.entangled.add(other)
    other.entangled.add(this)
  }

}


export class User extends Record<number> {

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


  constructor(id: number, dict: {}, userResolver: RecordResolver<number, User>, categoryResolver: RecordResolver<number, Category>) {
    super(id)

    this.createdTimestamp = dictutil.require<number>(dict, ['created'])
    this.seller = userResolver(dictutil.require<number>(dict, ['sellerId']))
    this.title = dictutil.require(dict, ['title'])
    this.category = categoryResolver(dictutil.require<number>(dict, ['categoryId']))
    this.description = dictutil.require(dict, ['description'])
    this.price = dictutil.require(dict, ['price'])
    this.pictureUris = dictutil.require(dict, ['pictureUris'])
    const buyerId: number = dictutil.require(dict, ['buyerId'])
    this.buyer = buyerId ? userResolver(buyerId) : null
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
