const should = require('should')
const request = require('supertest')

const mixed = require('./../../types/mixed')

describe('Mixed type', done => {
  it('should export a function', () => {
    (typeof mixed).should.eql('function')
  })

  it('should accept and validate a boolean', () => {
    const mockSchema = {
      type: 'mixed'
    }

    return mixed({
      schema: mockSchema,
      value: true
    })
  })

  it('should accept and validate a string', done => {
    const mockSchema = {
      type: 'mixed',
      validation: {
        minLength: 5
      }
    }

    mixed({
      schema: mockSchema,
      value: 'fine'
    }).catch(error => {
      error.should.be.instanceOf(Error)

      return mixed({
        schema: mockSchema,
        value: 'great'
      })
    }).then(done)
  })

  it('should accept and validate a number', done => {
    const mockSchema = {
      type: 'mixed',
      validation: {
        greaterThan: 5
      }
    }

    mixed({
      schema: mockSchema,
      value: 4
    }).catch(error => {
      error.should.be.instanceOf(Error)

      return mixed({
        schema: mockSchema,
        value: 6
      })
    }).then(done)
  })

  it('should accept and validate an array', () => {
    const mockSchema = {
      type: 'mixed'
    }

    mixed({
      schema: mockSchema,
      value: 1234
    }).catch(error => {
      error.should.be.instanceOf(Error)

      return mixed({
        schema: mockSchema,
        value: [1, 2, 3, 4]
      })
    }).then(done)
  })

  it('should accept an object', () => {
    const mockSchema = {
      type: 'mixed',
      validation: {
        greaterThan: 5
      }
    }

    return mixed({
      schema: mockSchema,
      value: {
        firstName: 'John',
        lastName: 'Doe'
      }
    })
  })
})
