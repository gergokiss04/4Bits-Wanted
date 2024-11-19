import { Mutex, Semaphore, SemaphoreInterface } from 'async-mutex'



export class Cache<TKey, TValue> {

  /*
    Gyakorlatilag bármennyi olvasót engedélyez, de az íroknak meg kell enniük az egészet egyszerre.
  */
  static readonly BIG_LIMIT = 4096
  static readonly WRITE_PRIORITY = 1 // A read priority mindig 0. A nagyobb magasabb.

  expireSeconds?: number = 120
  maxElements?: number = 256
  dict: Map<TKey, {timestamp: bigint, value: TValue}> = new Map()
  semaphore = new Semaphore(Cache.BIG_LIMIT)
  onDroppedCallback?: (value: TValue) => void


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


  dropUnsynchronized(key: TKey): boolean {
    const val = this.dict.get
    const result = this.dict.delete(key)
    this.onDroppedCallback()
    return result
  }

  public async insert(key: TKey, value: TValue) {
    await this.runExclusiveWrite(
      () => {
        // Ha túl sok van, kezdd el kidobálni a régieket
        if(this.maxElements !== undefined && this.maxElements >= 0 && this.dict.size >= this.maxElements) {
          for(const key of this.dict.keys()) {
            console.log(`${key} -> ${this.dict.get(key)?.value} dropped`) // HACK
            this.dropUnsynchronized(key) // Genuis! Elvileg insertion order szerint adja vissza a keys().
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
        if(this.expireSeconds === undefined) return

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
          if(!this.dropUnsynchronized(expiredKey)) throw new Error()
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
      (this.expireSeconds ?? 10) / 2
    )
  }

}
