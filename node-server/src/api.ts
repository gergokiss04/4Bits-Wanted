import http from 'http'
import { User, Offer, Category, Record } from './records.js'


export abstract class Api {

  constructor() {
    // do nothing
  }

  async handle(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, path: string[]): Promise<void> {
    res.write(JSON.stringify(path))
    res.end()
    // TODO
  }

  abstract fetchUser(id: number): User | undefined
  abstract commitUser(val: User): void
  abstract dropUser(val: User): void

  abstract fetchOffer(id: number): Offer | undefined
  abstract commitOffer(val: Offer): void
  abstract dropOffer(val: Offer): void

  abstract fetchCategory(id: number): Category | undefined
  abstract commitCategory(val: Category): void
  abstract dropCategory(val: Category): void



}
