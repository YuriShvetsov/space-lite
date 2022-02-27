import { generateId, getTargetFromProxy } from './helpers'
import * as themes from './themes'

export default {
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
    } else {
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
  MOVE_LIST(state, { listId, targetListId }) {
    const list = state.lists.find(list => list.id === listId)
    const copyList = getTargetFromProxy(list)
    const listIndex = state.lists.findIndex(list => list.id === listId)
    const targetListIndex = state.lists.findIndex(list => list.id === targetListId)

    state.lists.splice(listIndex, 1)
    state.lists.splice(targetListIndex, 0, copyList)
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
  IMPORT_TODOS(state, { listId, todos }) {
    // Creating id for each imported todo
    const ids = []
    let timestamp = Date.now()

    for (let i = 0; i < todos.length; i++) {
      timestamp += 1
      ids.push('todo_' + timestamp.toString(36))
    }

    // Adding imported todos to current list
    const list = state.lists.find(list => list.id === listId)

    todos.forEach((todo, index) => {
      list.todos.push({
        id: ids[index],
        done: false,
        name: todo.name,
        notes: todo.notes,
        priority: todo.priority
      })
    })
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
  DUPLICATE_TODO(state, { listId, todoId }) {
    const list = state.lists.find(list => list.id === listId)
    const todo = list.todos.find(todo => todo.id === todoId)
    const insertIndex = list.todos.findIndex(todo => todo.id === todoId) + 1
    const copy = {
      id: generateId('todo'),
      done: false,
      priority: todo.priority,
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
  },
  SET_DEFAULT_THEME(state) {
    state.curTheme = themes.DEFAULT_THEME
  },
  SET_CUR_THEME(state, themeValue) {
    if (!themes.THEMES.includes(themeValue)) {
      throw new Error('Invalid theme value')
    }

    state.curTheme = themeValue
  },
  SET_SYSTEM_APPEARANCE(state, value) {
    const validValues = ['light', 'dark'];

    if (!validValues.includes(value)) {
      throw new Error('Invalid system appearance value')
    }

    state.systemAppearance = value
  }
}
