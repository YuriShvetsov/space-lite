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

  async create(data) {
    this.collection.insert({
      _id: uuid(),
      ...data
    })

    await this.save()
  }

  async find(options = {}, projection = {}) {
    return await this.collection.find(options, projection)
  }

  async findOne(options = {}) {
    return await this.collection.findOne(options)
  }

  update() {
    return new Promise((resolve, reject) => {

    })
  }

  remove() {
    return new Promise((resolve, reject) => {

    })
  }
}
