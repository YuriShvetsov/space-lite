import { get, chain, countBy } from 'lodash'
import ForerunnerDB from 'forerunnerdb'

import UsersCollection from './collections/users'
import ProjectsCollection from './collections/projects'
import TasksCollection from './collections/tasks'

const isDev = import.meta.env.DEV

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
    await this._initProjectsCollection()
    await this._initTasksCollection()

    this._initTasksCounter()

    this._ready()
  }

  async _initUsersCollection() {
    this.users = new UsersCollection(this.db)
    await this.users.init()
  }
  
  async _initProjectsCollection() {
    const user = this.users.collection.findOne()
    const userId = get(user, '_id', null)

    if (!userId) throw new Error('User not found')
    
    this.projects = new ProjectsCollection(this.db)

    await this.projects.init()
  }
  
  async _initTasksCollection() {
    this.tasks = new TasksCollection(this.db)
    await this.tasks.init()
  }

  _initTasksCounter() {
    this.tasksCounter = this.db.overview('tasksCounter')

    this.tasksCounter.from(this.tasks.collection)
    this.tasksCounter.reduce(function() {
      const tasks = [...this.find()]
      const result = chain(tasks)
        // .groupBy('userId')
        // .map((group, userId) => ({
        //   userId,
        //   hidden: group.hidden
        // }))
        .groupBy('projectId')
        .map((group, projectId) => ({
          projectId,
          ...countBy(group, rec => rec.hidden ? 'hidden' : 'visible')
        }))
        .value()

      return result
    })

    // console.log(this.tasksCounter.exec())
  }
  
  onReady(callback) {
    this._ready = callback ? callback : () => console.log('db_is_ready')
  }
}

const db = new Database()

export default db
