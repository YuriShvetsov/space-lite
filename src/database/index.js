import { get, set } from 'lodash'
import ForerunnerDB from 'forerunnerdb'

import UsersCollection from './collections/users'
import ListsCollection from './collections/lists'

const isDev = import.meta.env.DEV

const sleep = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Database {
  constructor() {
    const fdb = new ForerunnerDB()

    this.db = fdb.db('space_lite')
    this.db.persist.driver('IndexedDB')
    this.db.persist.debug(isDev)
    
    this._initCollections()
  }
  
  async _initCollections(app, options) {
    await this._initUsersCollection()
    await this._initListsCollection()
    // await this.initTasksCollection()
    
    await sleep(1000)

    this._ready()
  }

  async _initUsersCollection() {
    this.users = new UsersCollection(this.db)
    await this.users.init()
  }
  
  async _initListsCollection() {    
    const user = this.users.collection.findOne()
    const userId = get(user, '_id', null)

    if (!userId) throw new Error('User not found')
    
    this.lists = new ListsCollection(this.db)

    await this.lists.init()
  }
  
  async _initTasksCollection() {
    
  }
  
  onReady(callback) {
    this._ready = callback ? callback : () => console.log('db_is_ready')
  }
}

const db = new Database()

export default db
