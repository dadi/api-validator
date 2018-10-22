const array = require('./array')
const boolean = require('./boolean')
const datetime = require('./datetime')
const number = require('./number')
const string = require('./string')

module.exports = ({schema, value}) => {
  switch (typeof value) {
    case 'boolean':
      return boolean({schema, value})

    case 'number':
      return number({schema, value})

    case 'string':
      return string({schema, value})
  }

  if (value instanceof Date) {
    return datetime({schema, value})
  }

  if (Array.isArray(value)) {
    return array({schema, value})
  }

  return Promise.resolve()
}
