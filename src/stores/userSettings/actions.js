import { get, set } from 'lodash'
import db from '@/database'

export default {
  async init() {
    this.isInitialized = true

    const user = await db.getCurrentUser()
    
    this.userId = get(user, '_id', 'none')
    this.theme = get(user, 'ui.theme', 'light')
    this.showHiddenTasks = get(user, 'ui.showHiddenTasks', false)
  }
}
