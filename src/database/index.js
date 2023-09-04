import { get, set } from 'lodash'
import { v4 as uuid } from 'uuid'
import ForerunnerDB from 'forerunnerdb'

import Users from './collections/users'
import Lists from './collections/lists'

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
    //    this.initTasksCollection()
    
    await sleep(1000)

    this._ready()
  }

  async _initUsersCollection() {
    this.users = new Users(this.db)
    await this.users.init()
  }
  
  async _initListsCollection() {    
    const user = this.users.collection.findOne()
    const userId = get(user, '_id', null)

    if (!userId) throw new Error('User not found')
    
    this.lists = new Lists(this.db)
    await this.lists.init(userId)

    const list = this.lists.collection.findOne({ _id: userId })

    if (list) return
    
    const DEFAULT_LIST_DATA = {
      _id: uuid(),
      userId,
      name: 'Main',
      icon: 'list',
      tasks: []
    }

    this.lists.collection.insert(DEFAULT_LIST_DATA)
    await this.lists.save()
  }
  
  async _initTasksCollection() {
    
  }
  
  _ready() {
    this.readyHandler()
  }
  
  onReady(callback) {
    this.readyHandler = callback ? callback : () => console.log('db_is_ready')
  }
}

export const db = new Database()
export const users = db.users
export const lists = db.lists
