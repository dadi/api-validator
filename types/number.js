const ValidationError = require('./../lib/validation-error')

function validateFilters (validationBlock) {
  let filters = {}
  let numberFilters = [
    'equalTo',
    'greaterThan',
    'greaterThanOrEqualTo',
    'lessThan',
    'lessThanOrEqualTo'
  ]
  let booleanFilters = [
    'even',
    'integer'
  ]

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
    lessThanOrEqualTo,
    notInteger
  } = validateFilters(schema.validation || {})

  if (equalTo && (value !== equalTo.value)) {
    return new ValidationError(schema).reject(
      `is not equal to ${equalTo.value}`,
      'ERROR_EQUAL_TO'
    )
  }

  if (greaterThan && (value <= greaterThan.value)) {
    return new ValidationError(schema).reject(
      `is not greater than ${greaterThan.value}`,
      'ERROR_GREATER_THAN'
    )
  }

  if (greaterThanOrEqualTo && (value < greaterThanOrEqualTo.value)) {
    return new ValidationError(schema).reject(
      `is not greater than or equal to ${greaterThanOrEqualTo.value}`,
      'ERROR_GREATER_THAN_OR_EQUAL_TO'
    )
  }

  if (lessThan && (value >= lessThan.value)) {
    return new ValidationError(schema).reject(
      `is not less than ${lessThan.value}`,
      'ERROR_LESS_THAN'
    )
  }

  if (lessThanOrEqualTo && (value > lessThanOrEqualTo.value)) {
    return new ValidationError(schema).reject(
      `is not less than or equal to ${lessThanOrEqualTo.value}`,
      'ERROR_LESS_THAN_OR_EQUAL_TO'
    )
  }

  if (even) {
    let isEven = (value % 2) === 0

    if (isEven && !even.value) {
      return new ValidationError(schema).reject(
        'is not odd',
        'ERROR_ODD'
      )
    }

    if (!isEven && even.value) {
      return new ValidationError(schema).reject(
        'is not even',
        'ERROR_EVEN'
      )
    }
  }

  if (integer) {
    let isInteger = Number.isInteger(value)

    if (isInteger && !integer.value) {
      return new ValidationError(schema).reject(
        'is integer',
        'ERROR_NOT_INTEGER'
      )
    }

    if (!isInteger && integer.value) {
      return new ValidationError(schema).reject(
        'is not integer',
        'ERROR_INTEGER'
      )
    }
  }
  
  return Promise.resolve()
}
