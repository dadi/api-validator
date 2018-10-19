const ValidationError = require('./../lib/validation-error')

module.exports = ({schema, value}) => {
  if (typeof value !== 'boolean') {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
