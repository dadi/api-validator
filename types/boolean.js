const ValidationError = require('./../lib/validation-error')

module.exports = ({schema, value}) => {
  if (typeof value !== 'boolean' && value !== null && value !== undefined) {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
