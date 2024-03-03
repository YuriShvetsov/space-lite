import Joi from 'joi'

export default Joi.object({
  _id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  username: Joi.string()
    .required(),

  password: Joi.string()
    .required(),

  firstname: Joi.string()
    .required(),

  lastname: Joi.string()
    .required(),

  createdAt: Joi.string()
    .isoDate()
    .default((new Date()).toISOString()),

  lastLoginAt: Joi.string()
    .isoDate()
    .default((new Date()).toISOString()),

  settings: Joi.object({
    theme: Joi.string()
      .default('light')
  })
    .required()
})
