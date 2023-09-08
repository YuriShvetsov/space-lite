import { AsyncCollection } from '../utils/AsyncCollection'

export default class Tasks extends AsyncCollection {
  constructor(db) {
    super(db, 'tasks')
  }

  async init() {
    await this.load()
  }
}
