export default {
  migrate({ commit, dispatch }) {
    commit('MIGRATE')
    dispatch('writeToLS')
  },

  // Main

  init({ dispatch }) {
    dispatch('initThemes')
    dispatch('readFromLS')
  },
  readFromLS({ commit, dispatch }) {
    const data = JSON.parse(window.localStorage.getItem('todos'))

    if (!data) {
      commit('ADD_EMPTY_LIST')
      commit('OPEN_FIRST_LIST')
      commit('SET_CUR_THEME_BY_DEFAULT')
      commit('SET_DEFAULT_HIDDEN_TODOS_VISIBLE')
      dispatch('writeToLS')
      return
    }

    commit('SET_LISTS', data.lists)
    commit('SET_OPENED_LIST_ID', data.openedListId)
    commit('SET_CUR_THEME', data.curTheme)
    commit('SET_HIDDEN_TODOS_VISIBLE', data.hiddenTodosVisible)
  },
  writeToLS({ state }) {
    const json = JSON.stringify({
      lists: state.lists,
      openedListId: state.openedListId,
      curTheme: state.curTheme,
      hiddenTodosVisible: state.hiddenTodosVisible
    })

    window.localStorage.setItem('todos', json)
  },

  // Lists

  openList({ state, commit, dispatch }, id) {
    if (state.openedListId === id) return

    commit('OPEN_LIST', id)
    dispatch('writeToLS')
  },
  addList({ commit, dispatch }, name) {
    commit('ADD_LIST', name)
    commit('OPEN_LAST_LIST')
    dispatch('writeToLS')
  },
  updateListName({ commit, dispatch }, payload) {
    commit('UPDATE_LIST_NAME', payload)
    dispatch('writeToLS')
  },
  toggleHiddenTodosVisible({ commit, dispatch }) {
    commit('TOGGLE_HIDDEN_TODOS_VISIBLE')
    dispatch('writeToLS')
  },
  moveList({ commit, dispatch }, payload) {
    commit('MOVE_LIST', payload)
    dispatch('writeToLS')
  },
  removeList({ state, commit, dispatch }, id) {
    if (state.lists.length === 1) {
      commit('ADD_EMPTY_LIST')
      commit('OPEN_LAST_LIST')
    }
    else {
      commit('OPEN_CLOSEST_LIST', id)
    }

    commit('REMOVE_LIST', id)
    dispatch('writeToLS')
  },

  // Tasks (todos)

  removeCompletedTodos({ commit, dispatch }, id) {
    commit('REMOVE_COMPLETED_TODOS', id)
    dispatch('writeToLS')
  },
  addTodo({ commit, dispatch }, payload) {
    commit('ADD_TODO', payload)
    dispatch('writeToLS')
  },
  importTodos({ commit, dispatch }, payload) {
    commit('IMPORT_TODOS', payload)
    dispatch('writeToLS')
  },
  toggleTodo({ commit, dispatch }, payload) {
    commit('TOGGLE_TODO', payload)
    dispatch('writeToLS')
  },
  updateTodo({ commit, dispatch }, payload) {
    commit('UPDATE_TODO', payload)
    dispatch('writeToLS')
  },
  duplicateTodo({ commit, dispatch }, payload) {
    commit('DUPLICATE_TODO', payload)
    dispatch('writeToLS')
  },
  hideTodo({ commit, dispatch }, payload) {
    commit('HIDE_TODO', payload)
    dispatch('writeToLS')
  },
  showTodo({ commit, dispatch }, payload) {
    commit('SHOW_TODO', payload)
    dispatch('writeToLS')
  },
  moveTodo({ commit, dispatch }, payload) {
    commit('MOVE_TODO', payload)
    dispatch('writeToLS')
  },
  removeTodo({ commit, dispatch }, payload) {
    commit('REMOVE_TODO', payload)
    dispatch('writeToLS')
  },

  // Themes

  initThemes({ commit, dispatch }) {
    commit('ADD_MAIN_THEMES')
    dispatch('reactSystemAppearance')
  },
  changeCurTheme({ commit, dispatch }, payload) {
    commit('SET_CUR_THEME', payload)
    dispatch('writeToLS')
  },
  reactSystemAppearance({ commit }) {
    const preferColorSchemeIsSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all'

    if (!preferColorSchemeIsSupported) return

    commit('ADD_AUTO_THEME')

    const preferColorScheme = window.matchMedia('(prefers-color-scheme: light)')

    setSystemAppearance(preferColorScheme)
    preferColorScheme.addEventListener('change', setSystemAppearance)

    function setSystemAppearance(scheme) {
      const isLight = scheme.matches

      if (isLight) {
        commit('SET_SYSTEM_APPEARANCE', 'light')
      } else {
        commit('SET_SYSTEM_APPEARANCE', 'dark')
      }
    }
  }
}
