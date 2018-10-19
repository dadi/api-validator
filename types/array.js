const ValidationError = require('./../lib/validation-error')

module.exports = ({schema, value}) => {
  if (!Array.isArray(value)) {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
