const number = require('./../../types/number')

const mockSchema = {
  type: 'number',
  validation: {
    message: 'needs to be a good number'
  }
}

describe('Number type', () => {
  it('should export a function', () => {
    ;(typeof number).should.eql('function')
  })

  it('should reject if the input value is not a number', done => {
    number({
      schema: mockSchema,
      value: '1234'
    }).catch(error => {
      error.should.be.instanceOf(Error)
      error.message.should.eql(mockSchema.validation.message)

      done()
    })
  })

  it('should resolve if the input value is a number', () => {
    return number({
      schema: mockSchema,
      value: 1234
    })
  })

  describe('validation.equalTo', () => {
    it('should reject if the input value is not equal to the filter', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          equalTo: 5
        }
      })

      number({
        schema,
        value: 10
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is equal to the filter', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          equalTo: 5
        }
      })

      return number({
        schema,
        value: 5
      })
    })
  })

  describe('validation.even', () => {
    it('should reject if `even: true` and the input value is odd', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          even: true
        }
      })

      number({
        schema,
        value: 3
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should reject if `even: false` and the input value is even', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          even: false
        }
      })

      number({
        schema,
        value: 2
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if `even: true` and the input value is even', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          even: true
        }
      })

      return number({
        schema,
        value: 4
      })
    })

    it('should resolve if `even: false` and the input value is odd', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          even: false
        }
      })

      return number({
        schema,
        value: 3
      })
    })
  })

  describe('validation.greaterThan', () => {
    it('should reject if the input value is not greater than the filter', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          greaterThan: 5
        }
      })

      number({
        schema,
        value: 1
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is greater than the filter', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          greaterThan: 5
        }
      })

      return number({
        schema,
        value: 10
      })
    })
  })

  describe('validation.greaterThanOrEqualTo', () => {
    it('should reject if the input value is not greater than or equal to the filter', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          greaterThanOrEqualTo: 5
        }
      })

      number({
        schema,
        value: 1
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is greater than or equal to the filter', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          greaterThanOrEqualTo: 5
        }
      })

      return number({
        schema,
        value: 5
      }).then(() => {
        return number({
          schema,
          value: 6
        })
      })
    })
  })

  describe('validation.integer', () => {
    it('should reject if `integer: true` and the input value is not an integer', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          integer: true
        }
      })

      number({
        schema,
        value: 3.14
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should reject if `integer: false` and the input value is integer', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          integer: false
        }
      })

      number({
        schema,
        value: 2
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if `integer: true` and the input value is integer', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          integer: true
        }
      })

      return number({
        schema,
        value: 4
      })
    })

    it('should resolve if `integer: false` and the input value is not an integer', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          integer: false
        }
      })

      return number({
        schema,
        value: 3.14
      })
    })
  })

  describe('validation.lessThan', () => {
    it('should reject if the input value is not less than the filter', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          lessThan: 5
        }
      })

      number({
        schema,
        value: 10
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is less than the filter', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          lessThan: 5
        }
      })

      return number({
        schema,
        value: 1
      })
    })
  })

  describe('validation.lessThanOrEqualTo', () => {
    it('should reject if the input value is not less than or equal to the filter', done => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          lessThanOrEqualTo: 5
        }
      })

      number({
        schema,
        value: 10
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is less than or equal to the filter', () => {
      const schema = Object.assign({}, mockSchema, {
        validation: {
          lessThanOrEqualTo: 5
        }
      })

      return number({
        schema,
        value: 5
      }).then(() => {
        return number({
          schema,
          value: 1
        })
      })
    })
  })
})
