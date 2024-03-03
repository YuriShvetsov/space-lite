import { v4 as uuid } from 'uuid'

import Users from '~/db/collections/users'
import makeUser from '~/models/user'

export const addUser = (data) => {
  const user = makeUser({
    _id: uuid(),
    ...data
  })
  const newUser = {
    _id: user.getId(),
    username: user.getUsername(),
    password: user.getPassword(),
    firstname: user.getFirstname(),
    lastname: user.getLastname(),
    createdAt: user.getCreatedAt(),
    lastLoginAt: user.getLastLoginAt(),
    settings: user.getSettings()
  }

  // Users.create(newUser)

  return newUser
}
