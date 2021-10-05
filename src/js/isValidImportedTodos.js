export const isValidImportedTodos = data => {
  if (!Array.isArray(data)) return false

  for (let item of data) {
    if (typeof item !== 'object') return false

    if (!item.hasOwnProperty('id') ||
        !item.hasOwnProperty('name') ||
        !item.hasOwnProperty('todos')) {
      return false
    }

    if (typeof item['id'] !== 'string' ||
        typeof item['name'] !== 'string' ||
        !Array.isArray(item['todos'])) {
      return false
    }

    for (let todo of item['todos']) {
      if (!todo.hasOwnProperty('id') ||
          !todo.hasOwnProperty('done') ||
          !todo.hasOwnProperty('name') ||
          !todo.hasOwnProperty('notes') ||
          !todo.hasOwnProperty('priority')) {
        return false
      }

      if (typeof todo['id'] !== 'string' ||
          typeof todo['done'] !== 'boolean' ||
          typeof todo['name'] !== 'string' ||
          typeof todo['notes'] !== 'string' ||
          typeof todo['priority'] !== 'string') {
        return false
      }

      if (!['', 'low', 'middle', 'high'].includes(todo['priority'].toLowerCase())) {
        return false
      }
    }
  }

  return true
}
