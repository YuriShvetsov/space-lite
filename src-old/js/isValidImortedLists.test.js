import { isValidImportedLists } from './isValidImportedLists'

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
            notes: 'Some note-board',
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
            notes: 'Some note-board',
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
            name: 'Task 1',
            notes: 'Some note-board',
            priority: 'high',
            hidden: false
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
            notes: 'Some note-board',
            priority: 'high',
            hidden: true
          },
          {
            id: 'todo-1201',
            done: false,
            name: 'Task 3',
            notes: 'Some note-board',
            priority: '',
            hidden: false
          }
        ]
      }
    ],
    output: true
  },

]

describe('Test of isValidImportedLists function:', () => {

  for (let index in testValues) {
    test(`Test ${ +index + 1 }: ${testValues[index].input}`, () => {
      const input = testValues[index].input
      const output = testValues[index].output

      expect(isValidImportedLists(input)).toBe(output)
    })
  }

})
