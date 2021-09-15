import { createStore, createLogger } from 'vuex'

const debug = process.env.NODE_ENV !== 'production'

// window.localStorage.removeItem('todos')

function generateId(prefix) {
  return prefix + '_' + Date.now().toString(36)
}

function getTargetFromProxy(proxy) {
  const constructor = Object.getPrototypeOf(proxy).constructor()
  const target = Object.assign(constructor, proxy)

  for (let prop in target) {
    if (typeof target[prop] === 'object') {
      target[prop] = getTargetFromProxy(target[prop])
    }
  }

  return target
}

const store = createStore({
  state: {
    lists: [],
    openedListId: null
  },
  getters: {
    openedList(state) {
      return state.lists.find(list => list.id === state.openedListId)
    }
  },
  mutations: {
    SET_LISTS(state, lists) {
      state.lists = lists
    },
    SET_OPENED_LIST_ID(state, id) {
      state.openedListId = id
    },
    ADD_EMPTY_LIST(state) {
      state.lists.push({
        id: generateId('list'),
        name: 'Main',
        todos: []
      })
    },
    OPEN_FIRST_LIST(state) {
      state.openedListId = state.lists[0].id
    },
    OPEN_LAST_LIST(state) {
      state.openedListId = state.lists[state.lists.length - 1].id
    },
    OPEN_CLOSEST_LIST(state, id) {
      const curIndex = state.lists.findIndex(l => l.id === id)
      const lastIndex = state.lists.length - 1

      if (lastIndex > curIndex) {
        state.openedListId = state.lists[curIndex + 1].id
      }
      else {
        state.openedListId = state.lists[curIndex - 1].id
      }
    },
    OPEN_LIST(state, id) {
      state.openedListId = id
    },
    ADD_LIST(state, name) {
      const newList = {
        id: generateId('list'),
        name,
        todos: []
      }

      state.lists.push(newList)
    },
    UPDATE_LIST_NAME(state, { id, name }) {
      const list = state.lists.find(l => l.id === id)

      list.name = name
    },
    REMOVE_COMPLETED_TODOS(state, id) {
      const list = state.lists.find(list => list.id === id)
      const todos = getTargetFromProxy(list.todos)

      list.todos = todos.filter(todo => !todo.done)
    },
    REMOVE_LIST(state, id) {
      const listIndex = state.lists.findIndex(l => l.id === id)

      state.lists.splice(listIndex, 1)
    },
    ADD_TODO(state, { id, name, notes, priority }) {
      const list = state.lists.find(l => l.id === id)
      const newTodo = {
        id: generateId('todo'),
        done: false,
        name,
        notes,
        priority
      }

      list.todos.push(newTodo)
    },
    TOGGLE_TODO(state, { listId, todoId }) {
      const list = state.lists.find(list => list.id === listId)
      const todo = list.todos.find(todo => todo.id === todoId)

      todo.done = !todo.done
    },
    UPDATE_TODO(state, { listId, todoId, name, notes, priority }) {
      const list = state.lists.find(list => list.id === listId)
      const todo = list.todos.find(todo => todo.id === todoId)

      todo.name = name
      todo.notes = notes
      todo.priority = priority
    },
    DUBLICATE_TODO(state, { listId, todoId }) {
      const list = state.lists.find(list => list.id === listId)
      const todo = list.todos.find(todo => todo.id === todoId)
      const insertIndex = list.todos.findIndex(todo => todo.id === todoId) + 1
      const copy = {
        id: generateId('todo'),
        done: false,
        name: todo.name,
        notes: todo.notes
      }

      list.todos.splice(insertIndex, 0, copy)
    },
    REMOVE_TODO(state, { listId, todoId }) {
      const list = state.lists.find(list => list.id === listId)
      const todoIndex = list.todos.findIndex(todo => todo.id === todoId)

      list.todos.splice(todoIndex, 1)
    },
    MOVE_TODO(state, { listId, todoId, targetTodoId }) {
      const list = state.lists.find(list => list.id === listId)
      const todoIndex = list.todos.findIndex(todo => todo.id === todoId)
      const copyTodo = getTargetFromProxy(list.todos[todoIndex])
      const targetIndex = list.todos.findIndex(todo => todo.id === targetTodoId)

      list.todos.splice(todoIndex, 1)
      list.todos.splice(targetIndex, 0, copyTodo)
    }
  },
  actions: {
    init({ dispatch }) {
      dispatch('readFromLS')
    },
    readFromLS({ commit, dispatch }) {
      const data = JSON.parse(window.localStorage.getItem('todos'))

      if (!data) {
        commit('ADD_EMPTY_LIST')
        commit('OPEN_FIRST_LIST')
        dispatch('writeToLS')
        return
      }

      commit('SET_LISTS', data.lists)
      commit('SET_OPENED_LIST_ID', data.openedListId)
    },
    writeToLS({ state }) {
      const json = JSON.stringify({
        lists: state.lists,
        openedListId: state.openedListId
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
    toggleTodo({ commit, dispatch }, payload) {
      commit('TOGGLE_TODO', payload)
      dispatch('writeToLS')
    },
    updateTodo({ commit, dispatch }, payload) {
      commit('UPDATE_TODO', payload)
      dispatch('writeToLS')
    },
    dublicateTodo({ commit, dispatch }, payload) {
      commit('DUBLICATE_TODO', payload)
      dispatch('writeToLS')
    },
    removeTodo({ commit, dispatch }, payload) {
      commit('REMOVE_TODO', payload)
      dispatch('writeToLS')
    },
    moveTodo({ commit, dispatch }, payload) {
      commit('MOVE_TODO', payload)
      dispatch('writeToLS')
    }
  },
  plugins: debug ? [createLogger()] : []
});

store.dispatch('init')

export default store
