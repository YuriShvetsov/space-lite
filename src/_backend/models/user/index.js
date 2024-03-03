import buildMakeUser from './user'
import userSchema from './user-schema'
import validator from '../validator'

const userValidator = validator(userSchema)
const makeUser = buildMakeUser(userValidator)

export default makeUser
