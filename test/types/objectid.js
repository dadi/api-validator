const should = require('should')
const request = require('supertest')

const objectid = require('./../../types/objectid')

const mockSchema = {
  type: 'ObjectID'
}

describe('ObjectID type', done => {
  it('should export a function', () => {
    (typeof objectid).should.eql('function')
  })

  it('should reject if the input value is not an ObjectId', done => {
    objectid({
      schema: mockSchema,
      value: [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd79943901'
      ]
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.code.should.eql('ERROR_VALUE_INVALID')
      error.message.should.be.instanceOf(String)

      done()
    })
  })

  it('should reject if the input value is an array with elements that are not ObjectId', done => {
    objectid({
      schema: mockSchema,
      value: '507f1f77bcf86cd79943901'
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.code.should.eql('ERROR_VALUE_INVALID')
      error.message.should.be.instanceOf(String)

      done()
    })
  })

  it('should resolve if the input value is an ObjectId', () => {
    return objectid({
      schema: mockSchema,
      value: '507f1f77bcf86cd799439011'
    })
  })

  it('should resolve if the input value is an array of ObjectId', () => {
    return objectid({
      schema: mockSchema,
      value: [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013'
      ]
    })
  })
})
