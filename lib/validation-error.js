const VALIDATION_ERROR_TYPES = {
  _DEFAULT: 'The value is not valid',
  UNKNOWN_TYPE: 'The field type specified in the schema is not supported by this instance of DADI API',
  WRONG_TYPE: 'The value supplied is of the wrong type',
  WRONG_VALUE: 'The value supplied is not valid for the field'
}

class ValidationError {
  constructor (schema = {}) {
    this.schema = schema
  }

  getErrorMessage (code) {
    let messageFromSchema = (this.schema.validation && this.schema.validation.message) ||
      this.schema.message
    let messageFromCode = VALIDATION_ERROR_TYPES[code] || VALIDATION_ERROR_TYPES._DEFAULT

    return messageFromSchema || messageFromCode
  }

  reject (code) {
    return Promise.reject(
      this.getErrorMessage(code)
    )
  }
}

module.exports = ValidationError

Object.keys(VALIDATION_ERROR_TYPES).forEach(code => {
  module.exports[code] = VALIDATION_ERROR_TYPES[code]
})
