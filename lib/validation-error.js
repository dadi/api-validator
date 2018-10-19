const VALIDATION_ERROR_TYPES = {
  TYPE_INVALID: 'The value supplied is of the wrong type',
  VALUE_INVALID: 'The value supplied is not valid for the field'
}

class ValidationError {
  constructor (schema = {}) {
    this.schema = schema
  }

  getErrorMessage (code) {
    let messageFromSchema = (this.schema.validation && this.schema.validation.message) ||
      this.schema.message
    let messageFromCode = VALIDATION_ERROR_TYPES[code] || VALIDATION_ERROR_TYPES.VALUE_INVALID

    return messageFromSchema || messageFromCode
  }

  reject (code) {
    return Promise.reject(
      new Error(this.getErrorMessage(code))
    )
  }
}

module.exports = ValidationError

Object.keys(VALIDATION_ERROR_TYPES).forEach(code => {
  module.exports[code] = VALIDATION_ERROR_TYPES[code]
})
