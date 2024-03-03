const buildMakeUser = (userValidator) => {
  return ({
    _id,
    username,
    password,
    firstname,
    lastname,
    createdAt,
    lastLoginAt,
    settings
  } = {}) => {
    const { error, value } = userValidator({
      _id,
      username,
      password,
      firstname,
      lastname,
      createdAt,
      lastLoginAt,
      settings
    })

    if (error) throw new Error(error)

    return {
      getId: () => value._id,
      getUsername: () => value.username,
      getPassword: () => value.password,
      getFirstname: () => value.firstname,
      getLastname: () => value.lastname,
      getCreatedAt: () => value.createdAt,
      getLastLoginAt: () => value.lastLoginAt,
      getSettings: () => value.settings
    }
  }
}

export default buildMakeUser
