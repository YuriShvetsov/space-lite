class Collection {
  constructor(name) {
    this._name = name
    this._collection = null

    this._isLoading = false
    this._isReady = false
    this._readyPromise = null
  }

  async create() {
    await this._load()
  }

  async find() {
    await this._load()
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

    this._readyPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          await this._collection.load()
          resolve()
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
