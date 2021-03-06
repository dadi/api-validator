const ValidationError = require('./../lib/validation-error')

function validateFilters(validationBlock) {
  const filters = {}
  const numberFilters = [
    'equalTo',
    'greaterThan',
    'greaterThanOrEqualTo',
    'lessThan',
    'lessThanOrEqualTo'
  ]
  const booleanFilters = ['even', 'integer']

  // Validating number filters.
  numberFilters.forEach(filter => {
    if (
      typeof validationBlock[filter] !== 'undefined' &&
      typeof validationBlock[filter] === 'number'
    ) {
      filters[filter] = {
        value: validationBlock[filter]
      }
    }
  })

  // Validating boolean filters.
  booleanFilters.forEach(filter => {
    if (
      typeof validationBlock[filter] !== 'undefined' &&
      typeof validationBlock[filter] === 'boolean'
    ) {
      filters[filter] = {
        value: validationBlock[filter]
      }
    }
  })

  return filters
}

module.exports = ({schema, value}) => {
  if (typeof value !== 'number') {
    return new ValidationError(schema).reject()
  }

  const {
    equalTo,
    even,
    greaterThan,
    greaterThanOrEqualTo,
    integer,
    lessThan,
    lessThanOrEqualTo
  } = validateFilters(schema.validation || {})

  if (equalTo && value !== equalTo.value) {
    return new ValidationError(schema).reject(
      `must be equal to ${equalTo.value}`,
      'ERROR_EQUAL_TO'
    )
  }

  if (greaterThan && value <= greaterThan.value) {
    return new ValidationError(schema).reject(
      `must be greater than ${greaterThan.value}`,
      'ERROR_GREATER_THAN'
    )
  }

  if (greaterThanOrEqualTo && value < greaterThanOrEqualTo.value) {
    return new ValidationError(schema).reject(
      `must be greater than or equal to ${greaterThanOrEqualTo.value}`,
      'ERROR_GREATER_THAN_OR_EQUAL_TO'
    )
  }

  if (lessThan && value >= lessThan.value) {
    return new ValidationError(schema).reject(
      `must be less than ${lessThan.value}`,
      'ERROR_LESS_THAN'
    )
  }

  if (lessThanOrEqualTo && value > lessThanOrEqualTo.value) {
    return new ValidationError(schema).reject(
      `must be less than or equal to ${lessThanOrEqualTo.value}`,
      'ERROR_LESS_THAN_OR_EQUAL_TO'
    )
  }

  if (even) {
    const isEven = value % 2 === 0

    if (isEven && !even.value) {
      return new ValidationError(schema).reject('must be odd', 'ERROR_ODD')
    }

    if (!isEven && even.value) {
      return new ValidationError(schema).reject('must be even', 'ERROR_EVEN')
    }
  }

  if (integer) {
    const isInteger = Number.isInteger(value)

    if (isInteger && !integer.value) {
      return new ValidationError(schema).reject(
        'must not be integer',
        'ERROR_NOT_INTEGER'
      )
    }

    if (!isInteger && integer.value) {
      return new ValidationError(schema).reject(
        'must be integer',
        'ERROR_INTEGER'
      )
    }
  }

  return Promise.resolve()
}
