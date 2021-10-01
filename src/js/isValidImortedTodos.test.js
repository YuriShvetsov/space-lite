const { isValidImportedTodos } = require('./isValidImportedTodos')
const testValues = [
  {
    input: 10,
    output: false
  },
  {
    input: {},
    output: false
  },
  {
    input: [
      {
        id: 'id-10',
        name: 'Best name',
        todos: [
          {
            id: 'todo-1000',
            name: 'Task'
          }
        ]
      }
    ],
    output: false
  },
  {
    input: [
      {
        id: 'id-10',
        todos: [
          {
            id: 'todo-1000',
            name: 'Task',
            notes: 'Some notes',
            priority: 'high'
          }
        ]
      }
    ],
    output: false
  },
  {
    input: [
      {
        id: 'id-10',
        name: 'List name',
        todos: [
          {
            id: 'todo-1000',
            done: true,
            name: 'Task',
            notes: 'Some notes',
            priority: 'high'
          }
        ]
      },
      'some text'
    ],
    output: false
  },
  {
    input: [
      {
        id: 'id-10',
        name: 'List name 1',
        todos: [
          {
            id: 'todo-1000',
            done: true,
            name: 'Task1',
            notes: 'Some notes',
            priority: 'high'
          }
        ]
      },
      {
        id: 'id-15',
        name: 'List name 2',
        todos: [
          {
            id: 'todo-1200',
            done: true,
            name: 'Task 2',
            notes: 'Some notes',
            priority: 'high'
          },
          {
            id: 'todo-1201',
            done: false,
            name: 'Task 3',
            notes: 'Some notes',
            priority: ''
          }
        ]
      }
    ],
    output: true
  },

]

describe('Test of isValidImportedTodos function:', () => {

  for (let index in testValues) {
    test(`Test ${ +index + 1 }: ${testValues[index].input}`, () => {
      const input = testValues[index].input
      const output = testValues[index].output

      expect(isValidImportedTodos(input)).toBe(output)
    })
  }

})
