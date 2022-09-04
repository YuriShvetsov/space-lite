import * as themes from './themes'

export default {
  openedList(state) {
    return state.lists.find(list => list.id === state.openedListId)
  },
  lists(state) {
    return state.lists
  },
  hiddenTodosVisible(state) {
    return state.hiddenTodosVisible
  },
  themes(state) {
    return state.themes
  },
  curTheme(state) {
    return state.curTheme
  },
  curThemeIsDark(state) {
    return state.curTheme === themes.DARK_THEME
  },
  curThemeIsAuto(state) {
    return state.curTheme === themes.AUTO_THEME
  },
  systemAppearanceIsDark(state) {
    return state.systemAppearance === 'dark'
  }
}
