const types = {
  array: require('./types/array'),
  boolean: require('./types/boolean'),
  datetime: require('./types/datetime'),
  media: require('./types/media'),
  mixed: require('./types/mixed'),
  number: require('./types/number'),
  object: require('./types/object'),
  objectid: require('./types/objectid'),
  reference: require('./types/reference'),
  string: require('./types/string')
}
const ValidationError = require('./lib/validation-error')

class Validator {
  constructor ({
    i18nFieldCharacter = ':',
    internalFieldPrefix = '_'
  } = {}) {
    this.i18nFieldCharacter = i18nFieldCharacter
    this.internalFieldPrefix = internalFieldPrefix
  }

  validateDocument ({
    document = {},
    isUpdate = false,
    schema = {}
  }) {
    let errors = []
    let chain = Promise.resolve()

    Object.keys(document).forEach(field => {
      let value = document[field]

      // Ignore internal fields.
      if (field.indexOf(this.internalFieldPrefix) === 0) {
        return
      }

      let canonicalName = field.split(this.i18nFieldCharacter)[0]
      let fieldSchema = schema[canonicalName]

      if (!fieldSchema) {
        return errors.push({
          code: 'ERROR_NOT_IN_SCHEMA',
          field,
          message: 'is not part of the schema'
        })
      }

      chain = chain.then(() => {
        return this.validateValue({
          schema: fieldSchema,
          value
        }).catch(error => {
          let errorData = {
            field,
            message: error.message
          }

          if (typeof error.code === 'string') {
            errorData.code = error.code
          }

          errors.push(errorData)
        })
      })
    })

    // Finding missing fields if we are validating a new document
    // (i.e. not an update).
    if (!isUpdate) {
      Object.keys(schema).forEach(field => {
        if (document[field] === undefined && schema[field].required) {
          return errors.push({
            code: 'ERROR_REQUIRED',
            field,
            message: 'must be specified'
          })
        }
      })
    }

    return chain.then(() => {
      if (errors.length > 0) {
        return Promise.reject(errors)
      }

      return
    })
  }

  validateDocuments ({documents, schema}) {
    documents = Array.isArray(documents) ? documents : [documents]

    return documents.reduce((chain, document) => {
      return chain.then(() => {
        return this.validateDocument({
          document,
          schema
        })
      })
    }, Promise.resolve())
  }

  validateValue ({schema, value}) {
    let type = schema.type && schema.type.toLowerCase()
    let typeHandler = types[type]

    if (typeof typeHandler !== 'function') {
      return new ValidationError().reject()
    }

    // We treat null values as a special case. If the field is required,
    // we reject with the `ERROR_REQUIRED` code, because technically the
    // field is not set. If the field is not required, we accept the value.
    if (value === null || value === undefined) {
      if (schema.required) {
        return new ValidationError().reject(
          'must be specified',
          'ERROR_REQUIRED'
        )
      }

      return Promise.resolve()
    }

    return typeHandler({
      schema,
      value
    })
  }
}

module.exports = Validator
