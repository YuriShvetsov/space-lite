import { v4 as uuid } from 'uuid'

import Users from '~/db/collections/users'
import makeUser from '~/models/user'

export const addUser = async (data) => {
  try {
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

    await Users.insert(newUser)

    return newUser
  } catch (err) {
    console.error(err.message)
  }
}

export const getAllUsers = async () => {
  const users = await Users.find()

  return users
}

export const findUsers = async (query = {}) => {
  return await Users.find(query)
}
