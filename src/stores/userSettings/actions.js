import { get, set } from 'lodash'
import { users } from '@/database'

export default {
  async init() {
    await this.setGeneralData()
    this.reactSystemAppearance()

    this.isInitialized = true
  },
  async setGeneralData() {
    const user = await users.findOne()

    this.userId = get(user, '_id', '')
    this.theme = get(user, 'ui.theme', 'light')
    this.showHiddenLists = get(user, 'ui.showHiddenLists', false)
    this.showHiddenTasks = get(user, 'ui.showHiddenTasks', false)
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
  setTheme(theme) {
    this.theme = theme
  },
  toggleShowHiddenTasks() {
    this.showHiddenTasks = !this.showHiddenTasks
  }
}
