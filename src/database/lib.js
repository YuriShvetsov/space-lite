import { v4 as uuid } from 'uuid'

export class AsyncCollection {
  constructor(db, name, options = {}) {
    this.db = db
    this.collection = this.db.collection(name, options)
  }

  load() {
    return new Promise((resolve, reject) => {
      this.collection.load(err => {
        if (err) reject(err)
        resolve()
      })
    })
  }
  
  save() {
    return new Promise((resolve, reject) => {
      this.collection.save(err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  async insert(data, callback) {
    const getResponse = () => {
      return new Promise(resolve => {
        this.collection.insert({
          _id: uuid(),
          ...data
        }, response => resolve(response))
      })
    }

    const response = await getResponse()

    await this.save()

    if (callback) callback(response)
  }

  async find(options = {}, projection = {}) {
    await this.load()
    return this.collection.find(options, projection)
  }

  async findOne(options = {}) {
    await this.load()
    return this.collection.findOne(options)
  }

  async update(options = {}, data = {}) {
    this.collection.update(options, data)
    await this.save()
  }

  async remove(options = {}) {
    this.collection.remove(options)
    await this.save()
  }
}
