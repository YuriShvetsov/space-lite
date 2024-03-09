import Joi from 'joi'

export default Joi.object({
  _id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  username: Joi.string()
    .min(4)
    .max(32)
    .required(),

  password: Joi.string()
    .min(4)
    .max(32)
    .required(),

  firstname: Joi.string()
    .min(2)
    .max(32)
    .required(),

  lastname: Joi.string()
    .min(2)
    .max(32)
    .required(),

  // createdAt: Joi.string()
  //   .isoDate()
  //   .default((new Date()).toISOString()),
  createdAt: Joi.date()
    .default(new Date()),

  lastLoginAt: Joi.string()
    .isoDate()
    .default((new Date()).toISOString()),

  settings: Joi.object({
    theme: Joi.string()
      .default('light')
  })
    .required()
})
