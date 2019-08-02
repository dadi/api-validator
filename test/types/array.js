const should = require('should')
const request = require('supertest')

const array = require('./../../types/array')

const mockSchema = {
  type: 'array',
  validation: {
    message: 'needs to be array'
  }
}

describe('array type', done => {
  it('should export a function', () => {
    ;(typeof array).should.eql('function')
  })

  it('should reject if the input value is not a array', done => {
    array({
      schema: mockSchema,
      value: '123'
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.message.should.eql(mockSchema.validation.message)

      done()
    })
  })

  it('should resolve if the input value is a array', () => {
    return array({
      schema: mockSchema,
      value: ['123', 123]
    })
  })
})
