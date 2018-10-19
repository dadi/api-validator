const types = {
  string: require('./types/string')
}
const ValidationError = require('./lib/validation-error')

module.exports.validateField = ({schema, value}) => {
  let type = schema.type && schema.type.toLowerCase()
  let typeHandler = types[type]

  if (typeof typeHandler !== 'function') {
    return Promise.reject(
      new ValidationError.UNKNOWN_TYPE()
    )
  }

  return typeHandler({
    schema,
    value
  })
}
