import { get } from 'lodash'

export default {
  id() {
    return get(this.user, '_id', null)
  },
  showHiddenProjects() {
    return get(this.user, 'settings.data.showHiddenProjects', false)
  },
  showHiddenTasks() {
    return get(this.user, 'settings.data.showHiddenTasks', false)
  },
  theme() {
    return get(this.user, 'settings.ui.theme')
  },
  isDarkTheme() {
    const theme = get(this.user, 'settings.ui.theme')

    return (
      theme === 'dark' ||
      theme === 'auto' && this.systemAppearance === 'dark'
    )
  }
}
