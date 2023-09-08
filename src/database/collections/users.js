import { AsyncCollection } from '../utils/AsyncCollection'

export default class Users extends AsyncCollection {
  constructor(db) {
    super(db, 'users', { capped: true, size: 1 })
  }
  
  async init() {
    await this.load()
    const user = this.collection.findOne()

    if (user) return

    const now = (new Date()).toISOString()

    const DEFAULT_USER_DATA = {
      firstName: 'admin',
      lastName: 'admin',
      createdAt: now,
      lastUsedAt: now,
      settings: {
        data: {
          showHiddenProjects: false,
          showHiddenTasks: false
        },
        ui: {
          theme: 'light'
        }
      }
    }

    await this.insert(DEFAULT_USER_DATA)
  }
}
