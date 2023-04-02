import { generateId, getTargetFromProxy } from './helpers'
import * as themes from './themes'

export default {
  MIGRATE(state) {

  },

  // Lists

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
    if (!name) throw new Error('The name cannot be empty')

    const newList = {
      id: generateId('list'),
      name,
      todos: []
    }

    state.lists.push(newList)
  },
  UPDATE_LIST_NAME(state, { id, name }) {
    if (!name) throw new Error('The name cannot be empty')

    const list = state.lists.find(l => l.id === id)

    list.name = name
  },
  SET_DEFAULT_HIDDEN_TODOS_VISIBLE(state) {
    state.hiddenTodosVisible = false
  },
  SET_HIDDEN_TODOS_VISIBLE(state, isVisible) {
    state.hiddenTodosVisible = isVisible
  },
  TOGGLE_HIDDEN_TODOS_VISIBLE(state) {
    state.hiddenTodosVisible = !state.hiddenTodosVisible
  },
  MOVE_LIST(state, { listId, targetListId }) {
    const list = state.lists.find(list => list.id === listId)
    const copyList = getTargetFromProxy(list)
    const listIndex = state.lists.findIndex(list => list.id === listId)
    const targetListIndex = state.lists.findIndex(list => list.id === targetListId)

    state.lists.splice(listIndex, 1)
    state.lists.splice(targetListIndex, 0, copyList)
  },
  REMOVE_LIST(state, id) {
    const listIndex = state.lists.findIndex(l => l.id === id)

    state.lists.splice(listIndex, 1)
  },

  // Tasks (todos)

  REMOVE_COMPLETED_TODOS(state, id) {
    const list = state.lists.find(list => list.id === id)
    const todos = getTargetFromProxy(list.todos)

    list.todos = todos.filter(todo => !todo.done)
  },
  REMOVE_TODOS(state, { listId, todosIds }) {
    const list = state.lists.find(list => list.id === listId)
    const todos = getTargetFromProxy(list.todos)

    list.todos = todos.filter(todo => !todosIds.includes(todo.id))
  },
  ADD_TODO(state, { id, name, notes, priority }) {
    if (!name) throw new Error('The name cannot be empty')

    const list = state.lists.find(l => l.id === id)
    const newTodo = {
      id: generateId('todo'),
      done: false,
      hidden: false,
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
      ids.push(`todo-${ timestamp.toString(36) }`)
    }

    // Adding imported todos to current list
    const list = state.lists.find(list => list.id === listId)

    todos.forEach((todo, index) => {
      list.todos.push({
        id: ids[index],
        done: false,
        hidden:todo.hidden,
        name: todo.name,
        notes: todo.notes,
        priority: todo.priority
      })
    })
  },
  AUTO_IMPORT_TODOS(state, todos) {
    let listNumberId = Date.now()
    let todoNumberId = Date.now()
    
    todos.forEach(todo => {
      const list = state.lists.find(list => list.name === todo.listName)
      const newTodo = {
        id: `todo-${ todoNumberId.toString(36) }`,
        done: false,
        hidden:todo.hidden,
        name: todo.name,
        notes: todo.notes,
        priority: todo.priority
      }

      if (list) {
        list.todos.push(newTodo)
      } else {
        state.lists.push({
          id: `list-${ todoNumberId.toString(36) }`,
          name: todo.listName,
          todos: [ newTodo ]
        })

        listNumberId += 1
      }

      todoNumberId += 1
    })
  },
  TOGGLE_TODO(state, { listId, todoId }) {
    const list = state.lists.find(list => list.id === listId)
    const todo = list.todos.find(todo => todo.id === todoId)

    todo.done = !todo.done
  },
  UPDATE_TODO(state, { listId, todoId, name, notes, priority }) {
    if (!name) throw new Error('The name cannot be empty')

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
      hidden: todo.hidden,
      priority: todo.priority,
      name: todo.name,
      notes: todo.notes
    }

    list.todos.splice(insertIndex, 0, copy)
  },
  HIDE_TODO(state, { listId, todoId }) {
    const list = state.lists.find(list => list.id === listId)
    const todo = list.todos.find(todo => todo.id === todoId)

    todo.hidden = true
  },
  SHOW_TODO(state, { listId, todoId }) {
    const list = state.lists.find(list => list.id === listId)
    const todo = list.todos.find(todo => todo.id === todoId)

    todo.hidden = false
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

  // Themes

  ADD_MAIN_THEMES(state) {
    state.themes = [themes.LIGHT_THEME, themes.DARK_THEME]
  },
  ADD_AUTO_THEME(state) {
    state.themes.push(themes.AUTO_THEME)
  },
  SET_CUR_THEME_BY_DEFAULT(state) {
    state.curTheme = themes.DEFAULT_THEME
  },
  SET_CUR_THEME(state, theme) {
    state.curTheme = theme
  },
  SET_SYSTEM_APPEARANCE(state, value) {
    const validValues = ['light', 'dark', null];

    if (!validValues.includes(value)) {
      throw new Error('Invalid system appearance value')
    }

    state.systemAppearance = value
  }
}
