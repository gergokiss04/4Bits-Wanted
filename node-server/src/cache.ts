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
  onDroppedCallback?: (key: TKey, value: TValue) => void
  populateCallback?: (key: TKey) => TValue | undefined
  logCallback?: (msg: string) => void


  static now(): bigint {
    return process.hrtime.bigint()
  }

  static elapsedSeconds(from: bigint, till: bigint): number {
    return Number((till - from) / 1_000_000_000n)
  }

  log(msg: string) {
    if(this.logCallback) this.logCallback(msg)
  }


  runExclusiveRead<T>(callback: SemaphoreInterface.Worker<T>): Promise<T> {
    return this.semaphore.runExclusive(callback, 1)
  }

  runExclusiveWrite<T>(callback: SemaphoreInterface.Worker<T>): Promise<T> {
    return this.semaphore.runExclusive(callback, Cache.BIG_LIMIT, Cache.WRITE_PRIORITY)
  }


  public dropUnsynchronized(key: TKey): TValue | undefined {
    const val = this.dict.get(key)?.value
    this.log(`Drop ${key} -> ${val}`)

    const result = this.dict.delete(key)
    if(result && val && this.onDroppedCallback) this.onDroppedCallback(key, val)

    return val
  }

  public async drop(key: TKey): Promise<TValue | undefined> {
    return await this.runExclusiveWrite(
      () => {
        return this.dropUnsynchronized(key)
      }
    )
  }

  public async flush() {
    return await this.runExclusiveWrite(
      () => {
        this.log('Flush')
        while(this.dict.size > 0) {
          let someKey: TKey | undefined
          for(const key of this.dict.keys()) {
            someKey = key
            break
          }
          if(!someKey) throw new Error('It should be impossible for this to be undefined.')

          this.dropUnsynchronized(someKey)
        }
      }
    )
  }

  public async insert(key: TKey, value: TValue) {
    await this.runExclusiveWrite(
      () => {
        this.log(`Insert ${key} -> ${value}`)
        // Ha túl sok van, kezdd el kidobálni a régieket
        if(this.maxElements !== undefined && this.maxElements >= 0 && this.dict.size >= this.maxElements) {
          for(const key of this.dict.keys()) {
            this.log('Need to drop due to capacity')
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
        const found = this.dict.get(key)?.value
        if(found) return found
        else if(this.populateCallback) {
          const populateResult = this.populateCallback(key)
          if(populateResult) {
            this.insert(key, populateResult)
            return populateResult
          } else {
            return undefined
          }
        } else {
          return undefined
        }
      }
    )
  }

  public async garbicCollect() {
    await this.runExclusiveWrite(
      () => {
        if(this.expireSeconds === undefined) return

        this.log('GC')

        const now = Cache.now()

        let expired: Array<TKey> = []

        for(const key of this.dict.keys()) {
          const valWithTime = this.dict.get(key)
          if(!valWithTime) throw new Error()

          if(Cache.elapsedSeconds(valWithTime.timestamp, now) > this.expireSeconds) {
            this.log(`${key} -> ${valWithTime.value} expired`)
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
      (this.expireSeconds ?? 10) * 1000 / 2
    )
  }

}
