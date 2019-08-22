const boolean = require('./../../types/boolean')

const mockSchema = {
  type: 'boolean',
  validation: {
    message: 'needs to be boolean'
  }
}

describe('Boolean type', () => {
  it('should export a function', () => {
    ;(typeof boolean).should.eql('function')
  })

  it('should reject if the input value is not a boolean', done => {
    boolean({
      schema: mockSchema,
      value: '1234'
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.message.should.eql(mockSchema.validation.message)

      done()
    })
  })

  it('should resolve if the input value is a boolean', () => {
    return boolean({
      schema: mockSchema,
      value: true
    }).then(() => {
      return boolean({
        schema: mockSchema,
        value: false
      })
    })
  })
})
