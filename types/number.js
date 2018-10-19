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

  if (
    (equalTo && (value !== equalTo.value)) ||
    (greaterThan && (value <= greaterThan.value)) ||
    (greaterThanOrEqualTo && (value < greaterThanOrEqualTo.value)) ||
    (lessThan && (value >= lessThan.value)) ||
    (lessThanOrEqualTo && (value > lessThanOrEqualTo.value))
  ) {
    return new ValidationError(schema).reject()
  }

  if (even) {
    let isEven = (value % 2) === 0

    if (isEven !== even.value) {
      return new ValidationError(schema).reject()
    }
  }

  if (integer && (Number.isInteger(value) !== integer.value)) {
    return new ValidationError(schema).reject()
  }
  
  return Promise.resolve()
}
