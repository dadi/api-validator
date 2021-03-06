const Validator = require('./../index')

describe('validateValue', () => {
  it('should not reject when a non-required field is set to null', () => {
    const validator = new Validator()

    return validator.validateValue({
      value: null,
      schema: {
        type: 'string'
      }
    })
  })

  it('should reject when a required field is set to null', done => {
    const validator = new Validator()

    validator
      .validateValue({
        value: null,
        schema: {
          required: true,
          type: 'string'
        }
      })
      .catch(error => {
        error.should.be.instanceof(Error)
        error.code.should.eql('ERROR_REQUIRED')
        error.message.should.be.instanceof(String)

        done()
      })
  })
})
