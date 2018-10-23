const ValidationError = require('./../lib/validation-error')
const shared = require('./../lib/shared')

module.exports = ({schema, value}) => {
  let isMongoId = typeof value === 'string' &&
    shared.isHexadecimal(value) &&
    value.length === 24

  return isMongoId ? Promise.resolve() : new ValidationError(schema).reject()
}
