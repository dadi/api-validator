const ValidationError = require('./../lib/validation-error')

function validateValue({schema, value}) {
  if (typeof value !== 'string') {
    return new ValidationError(schema).reject()
  }

  const {
    maxLength,
    minLength,
    regex
  } = schema.validation || {}

  if (maxLength && (value.length > maxLength)) {
    return new ValidationError(schema).reject(
      'is too long',
      'ERROR_MAX_LENGTH'
    )
  }

  if (minLength && (value.length < minLength)) {
    return new ValidationError(schema).reject(
      'is too short',
      'ERROR_MIN_LENGTH'
    )
  }

  if (regex && regex.pattern) {
    let pattern = regex.pattern

    if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
      pattern = pattern.source
    }

    let flags = typeof regex.flags === 'string' ? regex.flags : ''
    let regularExpression = new RegExp(pattern, flags)

    if (regularExpression.exec(value) === null) {
      return new ValidationError(schema).reject(
        `should match the pattern ${pattern}`,
        'ERROR_REGEX'
      )
    }    
  }

  return Promise.resolve()
}

module.exports = ({schema, value}) => {
  if (Array.isArray(value)) {
    let arrayValidation = value.map(valueNode => {
      return validateValue({
        schema,
        value: valueNode
      })
    })

    return Promise.all(arrayValidation).then(() => undefined).catch(error => {
      return new ValidationError(schema).reject()
    })
  }
  
  return validateValue({
    schema,
    value
  })
}
