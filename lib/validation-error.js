const VALIDATION_ERROR_TYPES = {
  VALUE_INVALID: 'is wrong type'
}

class ValidationError {
  constructor(schema = {}) {
    this.schema = schema
  }

  getError(message, code) {
    const messageFromSchema =
      (this.schema.validation && this.schema.validation.message) ||
      this.schema.message
    let errorMessage = messageFromSchema || message
    let errorCode = code

    if (!errorMessage) {
      errorMessage = VALIDATION_ERROR_TYPES.VALUE_INVALID
      errorCode = 'ERROR_VALUE_INVALID'
    }

    const error = new Error(errorMessage)

    if (errorCode) {
      error.code = errorCode
    }

    return error
  }

  reject(message, code) {
    return Promise.reject(this.getError(message, code))
  }
}

module.exports = ValidationError

Object.keys(VALIDATION_ERROR_TYPES).forEach(code => {
  module.exports[code] = VALIDATION_ERROR_TYPES[code]
})
