const should = require('should')
const request = require('supertest')

const string = require('./../../types/string')

const mockSchema = {
  type: 'string',
  validation: {
    message: 'needs to be a friendly string'
  }
}

describe('String type', done => {
  it('should export a function', () => {
    ;(typeof string).should.eql('function')
  })

  it('should reject if the input value is not a string', done => {
    string({
      schema: mockSchema,
      value: 1234
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.message.should.eql(mockSchema.validation.message)

      done()
    })
  })

  it('should reject if the field is required and the value is an empty string', done => {
    string({
      schema: Object.assign({}, mockSchema, {
        required: true
      }),
      value: ''
    }).catch(error => {
      error.should.be.instanceof(Error)
      error.code.should.eql('ERROR_REQUIRED')
      error.message.should.be.instanceof(String)

      done()
    })
  })

  it('should reject if the input value is an array where one of the elements is not a string', done => {
    string({
      schema: mockSchema,
      value: ['hello', 'world', 1234]
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.message.should.eql(mockSchema.validation.message)

      done()
    })
  })

  describe('validation.maxLength', () => {
    it('should reject if the input value is longer than the limit', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          maxLength: 5,
          message: 'The value must not contain more than 5 characters'
        }
      })

      string({
        schema,
        value: 'wonderful'
      }).catch(error => {
        error.should.be.instanceOf(Error)
        error.message.should.eql(schema.validation.message)

        done()
      })
    })

    it('should resolve if the input value is shorter than the limit', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          maxLength: 5,
          message: 'The value must not contain more than 5 characters'
        }
      })

      return string({
        schema,
        value: 'fine'
      }).then(() => {
        return string({
          schema,
          value: '       fine        '
        })
      })
    })

    it('should resolve if the input value is the same length as the limit', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          maxLength: 5,
          message: 'The value must not contain more than 5 characters'
        }
      })

      return string({
        schema,
        value: 'sweet'
      })
    })
  })

  describe('validation.minLength', () => {
    const schema = Object.assign({}, mockSchema, {
      validation: {
        minLength: 5,
        message: 'The value must contain more than 5 characters'
      }
    })

    it('should reject if the input value is shorter than the limit', done => {
      string({
        schema,
        value: 'fine'
      })
        .catch(error => {
          error.should.be.instanceOf(Error)
          error.message.should.eql(schema.validation.message)

          return string({
            schema,
            value: '       fine        '
          })
        })
        .catch(error => {
          error.should.be.instanceOf(Error)
          error.message.should.eql(schema.validation.message)

          done()
        })
    })

    it('should resolve if the input value is shorter than the limit', () => {
      return string({
        schema,
        value: 'wonderful'
      })
    })

    it('should resolve if the input value is the same length as the limit', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          maxLength: 5,
          message: 'The value must not contain more than 5 characters'
        }
      })

      return string({
        schema,
        value: 'sweet'
      })
    })
  })

  describe('validation.regex', () => {
    it('should reject if the input value does not match the regular expression', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          message: 'The value must be in the format `_[sequence of digits]_``',
          regex: {
            pattern: '^q+$'
          }
        }
      })

      string({
        schema,
        value: 'qqpqq'
      }).catch(error => {
        error.should.be.instanceOf(Error)
        error.message.should.eql(schema.validation.message)

        done()
      })
    })

    it('should resolve if the input value matches the regular expression', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          message: 'The value must be in the format `_[sequence of digits]_``',
          regex: {
            pattern: '^_(\\d*)_$'
          }
        }
      })

      return string({
        schema,
        value: '_123456_'
      })
    })

    it('should respect the `flags` property', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          message: 'The value must be in the format `_[sequence of digits]_``',
          regex: {
            pattern: '^whatever$'
          }
        }
      })

      return string({
        schema,
        value: 'WHATEVER'
      }).catch(error => {
        error.should.be.instanceOf(Error)
        error.message.should.eql(schema.validation.message)

        schema.validation.regex.flags = 'i'

        return string({
          schema,
          value: 'WHATEVER'
        })
      })
    })
  })
})
