const fecha = require('fecha')
const ValidationError = require('./../lib/validation-error')

function buildFilters (schema) {
  const availableFilters = ['after', 'before']

  return availableFilters.reduce((filters, filter) => {
    if (!schema.validation || !schema.validation[filter]) {
      return filters
    }

    let value = schema.validation[filter]
    let date = value === '$now' ? new Date() : parseDate(value, schema.format)

    if (date instanceof Date) {
      filters[filter] = {
        value: date.getTime()
      }
    }

    return filters
  }, {})
}

function parseDate (value, format) {
  let date

  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'number') {
    return new Date(value)
  }

  if (typeof value === 'string') {
    format = format || 'YYYY-MM-DDTHH:mm:ss.SSSZ'

    try {
      let date = fecha.parse(value, format)

      return date
    } catch (error) {
      return null
    }
  }

  return null
}

module.exports = ({schema = {}, value}) => {
  let date = parseDate(value, schema.format)

  if (!(date instanceof Date)) {
    return new ValidationError(schema).reject()
  }

  const {after, before} = buildFilters(schema)

  if (
    after && (after.value > date.getTime()) ||
    before && (before.value < date.getTime())
  ) {
    return new ValidationError(schema).reject()
  }

  return Promise.resolve()
}
