import { v4 as uuid } from 'uuid'
import { AsyncCollection } from '../lib'

export default class Lists extends AsyncCollection {
  constructor(db) {
    super(db, 'lists')
  }

  async init(userId, ) {
    await this.load()
  }
}
