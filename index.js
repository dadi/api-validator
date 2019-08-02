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
  constructor({i18nFieldCharacter = ':', internalFieldPrefix = '_'} = {}) {
    this.i18nFieldCharacter = i18nFieldCharacter
    this.internalFieldPrefix = internalFieldPrefix
  }

  validateDocument({document = {}, isUpdate = false, schema = {}}) {
    const errors = []
    let chain = Promise.resolve()

    Object.keys(document).forEach(field => {
      const value = document[field]

      // Ignore internal fields.
      if (field.indexOf(this.internalFieldPrefix) === 0) {
        return
      }

      const canonicalName = field.split(this.i18nFieldCharacter)[0]
      const fieldSchema = schema[canonicalName]

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
          const errorData = {
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

  validateDocuments({documents, schema}) {
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

  validateSchemaField(name, schema) {
    const errors = []

    if (typeof schema.type === 'string') {
      schema.type = schema.type.toLowerCase()

      if (!types[schema.type]) {
        const availableTypes = Object.keys(types).join(', ')

        errors.push({
          code: 'ERROR_INVALID_FIELD_TYPE',
          field: `fields.${name}`,
          message: `does not have a valid type (${schema.type}). Valid types: ${availableTypes}`
        })
      }
    } else {
      errors.push({
        code: 'ERROR_MISSING_FIELD_TYPE',
        field: `fields.${name}`,
        message: 'must contain a `type` property'
      })
    }

    return errors
  }

  validateSchemaFieldName(name) {
    const regExp = /^[a-zA-Z0-9_-]+$/

    if (typeof name !== 'string' || !regExp.test(name)) {
      return [
        {
          code: 'ERROR_INVALID_FIELD_NAME',
          field: `fields.${name}`,
          message: `must be a non-empty string matching the expression '${regExp.toString()}'`
        }
      ]
    }

    return []
  }

  validateSchemaFields(fields) {
    if (
      !fields ||
      typeof fields !== 'object' ||
      fields.toString() !== '[object Object]'
    ) {
      return Promise.reject([
        {
          code: 'ERROR_INVALID_FIELDS',
          field: 'fields',
          message: 'must be an object'
        }
      ])
    }

    if (Object.keys(fields).length === 0) {
      return Promise.reject([
        {
          code: 'ERROR_EMPTY_FIELDS',
          field: 'fields',
          message: 'must contain at least one field'
        }
      ])
    }

    const errors = Object.keys(fields).reduce((errors, fieldName) => {
      const fieldErrors = this.validateSchemaField(
        fieldName,
        fields[fieldName]
      ).concat(this.validateSchemaFieldName(fieldName))

      return errors.concat(fieldErrors)
    }, [])

    return errors.length > 0 ? Promise.reject(errors) : Promise.resolve()
  }

  validateSchemaSettings(settings) {
    if (
      !settings ||
      typeof settings !== 'object' ||
      settings.toString() !== '[object Object]'
    ) {
      return Promise.reject([
        {
          code: 'ERROR_INVALID_SETTINGS',
          field: 'settings',
          message: 'must be an object'
        }
      ])
    }

    const errors = []
    const {
      authenticate,
      cache,
      callback,
      count,
      defaultFilters,
      displayName,
      enableVersioning,
      fieldLimiters,
      index,
      versioningCollection
    } = settings

    if (
      authenticate !== null &&
      authenticate !== undefined &&
      typeof authenticate !== 'boolean'
    ) {
      const isVerbArray =
        Array.isArray(authenticate) &&
        authenticate.every(item => {
          return ['delete', 'get', 'post', 'put'].includes(
            item.toString().toLowerCase()
          )
        })

      if (!isVerbArray) {
        errors.push({
          code: 'ERROR_INVALID_SETTING',
          field: 'settings.authenticate',
          message:
            'must be a Boolean or an array including one or more HTTP verbs (DELETE, GET, POST, PUT)'
        })
      }
    }

    if (cache !== null && cache !== undefined && typeof cache !== 'boolean') {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.cache',
        message: 'must be a Boolean'
      })
    }

    if (
      count !== null &&
      count !== undefined &&
      (typeof count !== 'number' || !Number.isInteger(count) || count <= 0)
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.count',
        message: 'must be a positive, integer number'
      })
    }

    if (
      callback &&
      (typeof callback !== 'string' || callback.trim().length === 0)
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.callback',
        message: 'must be a non-empty string'
      })
    }

    if (
      defaultFilters !== null &&
      defaultFilters !== undefined &&
      defaultFilters.toString() !== '[object Object]'
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.defaultFilters',
        message: 'must be an object'
      })
    }

    if (
      displayName &&
      (typeof displayName !== 'string' || displayName.trim().length === 0)
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.displayName',
        message: 'must be a non-empty string'
      })
    }

    if (
      enableVersioning !== undefined &&
      typeof enableVersioning !== 'boolean'
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.enableVersioning',
        message: 'must be a Boolean'
      })
    }

    if (fieldLimiters !== null && fieldLimiters !== undefined) {
      if (fieldLimiters.toString() === '[object Object]') {
        let expectedValue

        const isFieldProjection = Object.keys(fieldLimiters).every(
          (fieldName, index) => {
            if (index === 0) {
              expectedValue = fieldLimiters[fieldName]
            } else if (fieldLimiters[fieldName] !== expectedValue) {
              return false
            }

            return (
              fieldLimiters[fieldName] === 1 || fieldLimiters[fieldName] === 0
            )
          }
        )

        if (!isFieldProjection) {
          errors.push({
            code: 'ERROR_INVALID_SETTING',
            field: 'settings.fieldLimiters',
            message:
              'must be an object with a field projection (i.e. field names as keys and either all 1 or all 0 as values)'
          })
        }
      } else {
        errors.push({
          code: 'ERROR_INVALID_SETTING',
          field: 'settings.fieldLimiters',
          message: 'must be an object'
        })
      }
    }

    if (index !== null && index !== undefined) {
      const values = Array.isArray(index) ? index : [index]
      const areValuesValid = values.every(
        value => value.toString() === '[object Object]'
      )

      if (!areValuesValid) {
        errors.push({
          code: 'ERROR_INVALID_SETTING',
          field: 'settings.index',
          message: 'must be an object or array of objects'
        })
      }
    }

    if (
      versioningCollection !== null &&
      versioningCollection &&
      (typeof versioningCollection !== 'string' ||
        versioningCollection.trim().length === 0)
    ) {
      errors.push({
        code: 'ERROR_INVALID_SETTING',
        field: 'settings.versioningCollection',
        message: 'must be a non-empty string'
      })
    }

    return errors.length > 0 ? Promise.reject(errors) : Promise.resolve()
  }

  validateValue({schema, value}) {
    const type = schema.type && schema.type.toLowerCase()
    const typeHandler = types[type]

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
