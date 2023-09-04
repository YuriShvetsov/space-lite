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
}
