import { get, set } from 'lodash'
import db from '@/database'

export default {

  // Startup actions

  async init(user) {
    this.user = user

    const now = (new Date()).toISOString()
    await db.users.update({ _id: user._id }, { lastUsedAt: now })
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

  // Main actions

  async changeTheme(theme) {
    const path = 'settings.ui.theme'

    // Update store

    set(this.user, path, theme)

    // Save to db

    await db.users.update({ _id: this.id }, {
      settings: {
        ui: { theme }
      }
    })
  },
  async toggleShowHiddenProjects() {
    const path = 'settings.data.showHiddenProjects'
    const newValue = !get(this.user, path, false)

    // Update store

    set(this.user, path, newValue)

    // Save to db

    await db.users.update({ _id: this.id }, {
      settings: {
        data: { showHiddenProjects: newValue }
      }
    })
  },
  async toggleShowHiddenTasks() {
    const path = 'settings.data.showHiddenTasks'
    const newValue = !get(this.user, path, false)

    // Update store

    set(this.user, path, newValue)

    // Save to db

    await db.users.update({ _id: this.id }, {
      settings: {
        data: { showHiddenTasks: newValue }
      }
    })
  }

}
