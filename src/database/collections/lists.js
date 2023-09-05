import { AsyncCollection } from '../lib'

export default class Lists extends AsyncCollection {
  constructor(db) {
    super(db, 'lists')
  }

  async init() {
    await this.load()
  }
}
