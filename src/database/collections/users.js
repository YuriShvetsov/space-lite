import { AsyncCollection } from '../utils/AsyncCollection'

export default class Users extends AsyncCollection {
  constructor(db) {
    super(db, 'users', { capped: true, size: 1 })
  }
  
  async init() {
    await this.load()
    const user = this.collection.findOne()

    if (user) return

    const DEFAULT_USER_DATA = {
      settings: {
        data: {
          showHiddenLists: false,
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
