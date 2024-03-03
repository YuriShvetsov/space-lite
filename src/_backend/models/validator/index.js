const validator = (schema) =>
  (payload) => {
    const { error, value } = schema.validate(payload)

    if (error) {
      const message = error.details.map((el) => el.message).join('\n')

      return { error: message }
    }

    return { value }
  }

export default validator
