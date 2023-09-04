import { AsyncCollection } from '../lib'

export default class Users extends AsyncCollection {
  constructor(db) {
    super(db, 'users', { capped: true, size: 1 })
  }
  
  async init() {
    await this.load()
    const user = this.collection.findOne()

    if (user) return

    const DEFAULT_USER_DATA = {
      lists: [],
      ui: {
        showHiddenLists: false,
        showHiddenTasks: false,
        theme: 'light'
      }
    }

    this.create(DEFAULT_USER_DATA)
  }
}
