const ValidationError = require('./../lib/validation-error')

module.exports = ({schema, value}) => {
  if (typeof value !== 'object' || Object(value) !== value) {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
