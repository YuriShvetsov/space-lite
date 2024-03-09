import { db } from '../connection'

class Collection {
  constructor(name) {
    this._db = db
    this._collection = this._db.collection(name, { primaryKey: '_id' })

    this._isLoading = false
    this._isReady = false
    this._readyPromise = null
  }

  async insert(data) {
    return new Promise((resolve, reject) => {
      (async () => {
        await this._load()

        this._collection.insert(data, (result) => {
          console.log(result)
        })
        this._collection.save((err) => {
          if (err) return reject(err)

          resolve(data)
        })
      })()
    })
  }

  async find(query = {}) {
    await this._load()

    return this._collection.find(query)
  }

  async update() {
    await this._load()
  }

  async delete() {
    await this._load()
  }

  _load() {
    if (this._isReady) return

    if (this._isLoading) return this._readyPromise

    this._isLoading = true

    this._readyPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          this._collection.load((err) => {
            if (err) {
              throw new Error(err.message)
            }

            resolve()
          })
        } catch (err) {
          reject(err)
        } finally {
          this._isReady = true
          this._isLoading = false
          this._readyPromise = null
        }
      })()
    })

    return this._readyPromise
  }
}

export default Collection
