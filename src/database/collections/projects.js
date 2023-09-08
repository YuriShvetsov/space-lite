import { AsyncCollection } from '../utils/AsyncCollection'

export default class Projects extends AsyncCollection {
  constructor(db) {
    super(db, 'projects')
  }

  async init() {
    await this.load()
  }
}
