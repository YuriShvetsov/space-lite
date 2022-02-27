export default {
  init({ dispatch }) {
    dispatch('readFromLS')
    dispatch('reactSystemAppearance')
  },
  readFromLS({ commit, dispatch }) {
    const data = JSON.parse(window.localStorage.getItem('todos'))

    if (!data) {
      commit('ADD_EMPTY_LIST')
      commit('OPEN_FIRST_LIST')
      commit('SET_DEFAULT_THEME')
      dispatch('writeToLS')
      return
    }

    commit('SET_LISTS', data.lists)
    commit('SET_OPENED_LIST_ID', data.openedListId)
    commit('SET_CUR_THEME', data.curTheme)
  },
  writeToLS({ state }) {
    const json = JSON.stringify({
      lists: state.lists,
      openedListId: state.openedListId,
      curTheme: state.curTheme
    })

    window.localStorage.setItem('todos', json)
  },
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
  moveList({ commit, dispatch }, payload) {
    commit('MOVE_LIST', payload)
    dispatch('writeToLS')
  },
  removeCompletedTodos({ commit, dispatch }, id) {
    commit('REMOVE_COMPLETED_TODOS', id)
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
  removeTodo({ commit, dispatch }, payload) {
    commit('REMOVE_TODO', payload)
    dispatch('writeToLS')
  },
  moveTodo({ commit, dispatch }, payload) {
    commit('MOVE_TODO', payload)
    dispatch('writeToLS')
  },
  changeCurTheme({ commit, dispatch }, payload) {
    commit('SET_CUR_THEME', payload)
    dispatch('writeToLS')
  },
  reactSystemAppearance({ commit }) {
    const preferColorScheme = window.matchMedia('(prefers-color-scheme: light)')

    setSystemAppearance(preferColorScheme)

    preferColorScheme.addEventListener('change', setSystemAppearance)

    function setSystemAppearance(scheme) {
      if (scheme.matches) {
        commit('SET_SYSTEM_APPEARANCE', 'light')
      } else {
        commit('SET_SYSTEM_APPEARANCE', 'dark')
      }
    }
  }
}
