const should = require('should')
const request = require('supertest')

const boolean = require('./../../types/boolean')

const mockSchema = {
  type: 'boolean',
  validation: {
    message: 'needs to be boolean'
  }
}

describe('Boolean type', done => {
  it('should export a function', () => {
    (typeof boolean).should.eql('function')
  })

  it('should reject if the input value is not a boolean', done => {
    boolean({
      schema: mockSchema,
      value: '1234'
    }).catch(error => {
      (error instanceof Error).should.eql(true)
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
