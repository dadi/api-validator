const {isHexadecimal} = require('./../lib/shared')
const ValidationError = require('./../lib/validation-error')

module.exports = ({schema, value}) => {
  let normalisedValue = Array.isArray(value) ? value : [value]
  let isCorrectType = normalisedValue && normalisedValue.every(value => {
    if (value === null) return true

    return value && (isHexadecimal(value) || isHexadecimal(value._id))
  })

  if (!isCorrectType) {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
