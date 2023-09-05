import { get, set } from 'lodash'

import db from '@/database'
import { useListsStore } from '@/stores/lists/index.js'

export default {
  async init() {
    if (this.isInitialized) return

    this.reactSystemAppearance()
    await this.setInitialData()

    this.isInitialized = true
  },
  async setInitialData() {
    const user = await db.users.findOne()

    this.userId = get(user, '_id', '')
    this.theme = get(user, 'settings.ui.theme', 'light')
    this.showHiddenLists = get(user, 'settings.data.showHiddenLists', false)
    this.showHiddenTasks = get(user, 'settings.data.showHiddenTasks', false)

    const listsStore = useListsStore()

    await listsStore.setInitialData({
      userId: this.userId,
    })
  },
  reactSystemAppearance() {
    const isPreferColorSchemeSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all'
    if (!isPreferColorSchemeSupported) return

    this.availableThemes.push('auto')

    const preferColorScheme = window.matchMedia('(prefers-color-scheme: light)')
    const setSystemAppearance = scheme => {
      const isLight = scheme.matches
      this.systemAppearance = isLight ? 'light' : 'dark'
    }

    setSystemAppearance(preferColorScheme)
    preferColorScheme.addEventListener('change', setSystemAppearance)
  },
  async setTheme(theme) {
    this.theme = theme

    await db.users.update({ _id: this.userId }, {
      settings: {
        ui: { theme }
      }
    })
  },
  async toggleShowHiddenLists() {
    this.showHiddenLists = !this.showHiddenLists

    await db.users.update({ _id: this.userId }, {
      settings: {
        data: { showHiddenLists: this.showHiddenLists }
      }
    })
  },
  async toggleShowHiddenTasks() {
    this.showHiddenTasks = !this.showHiddenTasks

    await db.users.update({ _id: this.userId }, {
      settings: {
        data: { showHiddenTasks: this.showHiddenTasks }
      }
    })
  }
}
