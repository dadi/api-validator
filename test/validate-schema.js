const Validator = require('./../index')

describe('validateSchemaFields', () => {
  it('should reject when the value is not an object', done => {
    const validator = new Validator()

    validator.validateSchemaFields('not-an-object').catch(errors => {
      const [error] = errors

      error.code.should.eql('ERROR_INVALID_FIELDS')
      error.message.should.be.instanceof(String)

      done()
    })
  })

  it('should reject when the value is am empty object', done => {
    const validator = new Validator()

    validator.validateSchemaFields({}).catch(errors => {
      const [error] = errors

      error.code.should.eql('ERROR_EMPTY_FIELDS')
      error.message.should.be.instanceof(String)

      done()
    })
  })

  it('should reject when one of the fields has an invalid name', done => {
    const validator = new Validator()

    validator
      .validateSchemaFields({
        $whatever: {
          type: 'string'
        },
        title: {
          type: 'string'
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_FIELD_NAME')
        error.field.should.eql('fields.$whatever')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when one of the fields is missing a type', done => {
    const validator = new Validator()

    validator
      .validateSchemaFields({
        title: {
          type: 'string'
        },
        subtitle: {
          label: 'Subtitle'
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_MISSING_FIELD_TYPE')
        error.field.should.eql('fields.subtitle')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when one of the fields is missing a type', done => {
    const validator = new Validator()

    validator
      .validateSchemaFields({
        title: {
          type: 'string'
        },
        subtitle: {
          type: 'uhoh'
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_FIELD_TYPE')
        error.field.should.eql('fields.subtitle')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should resolve when all the fields are valid', () => {
    const validator = new Validator()

    return validator.validateSchemaFields({
      field1: {
        type: 'String',
        label: 'Title',
        comments: 'The title of the entry',
        validation: {},
        required: false
      },
      title: {
        type: 'String',
        label: 'Title',
        comments: 'The title of the entry',
        validation: {},
        required: false,
        search: {
          weight: 2
        }
      },
      leadImage: {
        type: 'Media'
      },
      leadImageJPEG: {
        type: 'Media',
        validation: {
          mimeTypes: ['image/jpeg']
        }
      },
      legacyImage: {
        type: 'Reference',
        settings: {
          collection: 'mediaStore'
        }
      },
      fieldReference: {
        type: 'Reference',
        settings: {
          collection: 'test-reference-schema'
        }
      }
    })
  })
})

describe('validateSchemaSettings', () => {
  it('should reject when the value is not an object', done => {
    const validator = new Validator()

    validator.validateSchemaSettings('not-an-object').catch(errors => {
      const [error] = errors

      error.code.should.eql('ERROR_INVALID_SETTINGS')
      error.message.should.be.instanceof(String)

      done()
    })
  })

  it('should resolve when the value is an object', () => {
    const validator = new Validator()

    return validator.validateValue({
      value: null,
      schema: {
        type: 'string'
      }
    })
  })

  describe('authenticate', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          authenticate: 5
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.authenticate')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              authenticate: ['GET', 'POST', 'WHATEVER']
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.authenticate')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          authenticate: false
        })
        .then(() => {
          return validator.validateSchemaSettings({
            authenticate: ['GET', 'POST']
          })
        })
    })
  })

  describe('cache', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          cache: 5
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.cache')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              cache: ['GET', 'POST', 'WHATEVER']
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.cache')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          cache: false
        })
        .then(() => {
          return validator.validateSchemaSettings({
            cache: true
          })
        })
    })
  })

  describe('count', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          count: true
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.count')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              count: 0
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.count')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          count: 3
        })
        .then(() => {
          return validator.validateSchemaSettings({
            count: 30
          })
        })
    })
  })

  describe('callback', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          callback: 5
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.callback')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              callback: '   '
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.callback')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator.validateSchemaSettings({
        callback: 'myBooks'
      })
    })
  })

  describe('displayName', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          displayName: 5
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.displayName')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              displayName: '   '
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.displayName')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator.validateSchemaSettings({
        displayName: 'My books'
      })
    })
  })

  describe('defaultFilters', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          defaultFilters: ['what', 'is', 'this', 'for?']
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.defaultFilters')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              defaultFilters: true
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.defaultFilters')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          defaultFilters: {
            bar: {
              $in: ['hello', 'world']
            }
          }
        })
        .then(() => {
          return validator.validateSchemaSettings({
            defaultFilters: {
              foo: 'bar'
            }
          })
        })
    })
  })

  describe('enableVersioning', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          enableVersioning: 5
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.enableVersioning')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              enableVersioning: 'true'
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.enableVersioning')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          enableVersioning: false
        })
        .then(() => {
          return validator.validateSchemaSettings({
            enableVersioning: true
          })
        })
    })
  })

  describe('fieldLimiters', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          fieldLimiters: ['field1', 'field2']
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.fieldLimiters')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              fieldLimiters: {
                field1: 1,
                field2: 1,
                field3: 0
              }
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.fieldLimiters')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          fieldLimiters: {
            field1: 1,
            field2: 1
          }
        })
        .then(() => {
          return validator.validateSchemaSettings({
            fieldLimiters: {
              field1: 0,
              field2: 0
            }
          })
        })
    })
  })

  describe('index', () => {
    it('should reject when the value is not valid', done => {
      const validator = new Validator()

      validator
        .validateSchemaSettings({
          index: ['field1', 'field2']
        })
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_SETTING')
          error.field.should.eql('settings.index')
          error.message.should.be.instanceof(String)

          return validator
            .validateSchemaSettings({
              index: 'field1'
            })
            .catch(errors => {
              const [error] = errors

              error.code.should.eql('ERROR_INVALID_SETTING')
              error.field.should.eql('settings.index')
              error.message.should.be.instanceof(String)

              done()
            })
        })
    })

    it('should resolve when the value is valid', () => {
      const validator = new Validator()

      return validator
        .validateSchemaSettings({
          index: {
            keys: {field1: 1, field2: 1},
            options: {unique: true}
          }
        })
        .then(() => {
          return validator.validateSchemaSettings({
            index: [
              {
                keys: {field1: 1, field2: 1},
                options: {unique: true}
              }
            ]
          })
        })
    })
  })
})
