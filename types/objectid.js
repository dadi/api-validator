const ValidationError = require('./../lib/validation-error')
const shared = require('./../lib/shared')

function isMongoId (value) {
  return typeof value === 'string' &&
    shared.isHexadecimal(value) &&
    value.length === 24
}

module.exports = ({schema, value}) => {
  let isValid = Array.isArray(value) ?
    value.every(isMongoId) :
    isMongoId(value)

  return isValid ? Promise.resolve() : new ValidationError(schema).reject()
}
