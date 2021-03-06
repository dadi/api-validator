const ValidationError = require('./../lib/validation-error')

function validateValue({schema, value}) {
  if (typeof value !== 'string') {
    return new ValidationError(schema).reject()
  }

  const sanitisedValue = value.trim()

  if (schema.required && sanitisedValue.length === 0) {
    return new ValidationError(schema).reject(
      'must be specified',
      'ERROR_REQUIRED'
    )
  }

  const {maxLength, minLength, regex} = schema.validation || {}

  if (maxLength && sanitisedValue.length > maxLength) {
    return new ValidationError(schema).reject(
      `must be at most ${maxLength} characters long`,
      'ERROR_MAX_LENGTH'
    )
  }

  if (minLength && sanitisedValue.length < minLength) {
    return new ValidationError(schema).reject(
      `must be at least ${minLength} characters long`,
      'ERROR_MIN_LENGTH'
    )
  }

  if (regex && regex.pattern) {
    let pattern = regex.pattern

    if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
      pattern = pattern.source
    }

    const flags = typeof regex.flags === 'string' ? regex.flags : ''
    const regularExpression = new RegExp(pattern, flags)

    if (regularExpression.exec(sanitisedValue) === null) {
      return new ValidationError(schema).reject(
        'is not in the right format',
        'ERROR_REGEX'
      )
    }
  }

  return Promise.resolve()
}

module.exports = ({schema, value}) => {
  if (Array.isArray(value)) {
    const arrayValidation = value.map(valueNode => {
      return validateValue({
        schema,
        value: valueNode
      })
    })

    return Promise.all(arrayValidation)
      .then(() => undefined)
      .catch(() => {
        return new ValidationError(schema).reject()
      })
  }

  return validateValue({
    schema,
    value
  })
}
