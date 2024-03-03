import { app } from './app/index'

import { addUser } from '~/data-access'

app.mount('#app')

const user = addUser({
  username: 'root',
  password: 'root',
  firstname: 'John',
  lastname: 'Doe',
  lastLoginAt: (new Date).toISOString(),
  settings: {}
})

console.log(user)
