const should = require('should')
const request = require('supertest')

const object = require('./../../types/object')

const mockSchema = {
  type: 'object'
}

describe('Object type', done => {
  it('should export a function', () => {
    ;(typeof object).should.eql('function')
  })

  it('should reject if the input value is not an Object', done => {
    object({
      schema: mockSchema,
      value: '1234'
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.code.should.eql('ERROR_VALUE_INVALID')
      error.message.should.be.instanceOf(String)

      done()
    })
  })

  it('should resolve if the input value is an Object', () => {
    return object({
      schema: mockSchema,
      value: {
        name: 'John',
        age: 50
      }
    }).then(() => {
      return object({
        schema: mockSchema,
        value: {}
      })
    })
  })
})
