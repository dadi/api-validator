const should = require('should')
const request = require('supertest')

const datetime = require('./../../types/datetime')

const mockSchema = {
  type: 'datetime',
  format: 'YYYY-MM-DD'
}

describe('DateTime type', done => {
  it('should export a function', () => {
    (typeof datetime).should.eql('function')
  })

  it('should reject if the input value is not a valid date', done => {
    datetime({
      schema: mockSchema,
      value: '1234'
    }).catch(error => {
      error.should.be.instanceOf(Error)

      datetime({
        schema: {...mockSchema, format: 'DD-MM-YYYY'},
        value: '2018-03-01'
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })
  })

  it('should resolve if the input value is a datetime', () => {
    return datetime({
      schema: mockSchema,
      value: new Date()
    }).then(() => {
      return datetime({
        schema: {...mockSchema, format: 'DD-MM-YYYY'},
        value: '01-03-2018'
      })
    })
  })

  describe('validation.after', () => {
    it('should reject if the input value is a date prior to the limit', done => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          after: '2018-03-01'
        }
      })

      datetime({
        schema,
        value: '2018-01-01'
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is a date after the limit', () => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          after: '2018-03-01'
        }
      })

      return datetime({
        schema,
        value: '2018-08-31'
      })
    })

    it('should replace the `$now` placeholder with the current date', done => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          after: '$now'
        }
      })
      let value = new Date()

      value.setMonth(value.getMonth() - 1)

      datetime({
        schema,
        value
      }).catch(error => {
        error.should.be.instanceOf(Error)

        value.setMonth(value.getMonth() + 2)

        datetime({
          schema,
          value
        }).then(done)
      })
    })
  })

  describe('validation.before', () => {
    it('should reject if the input value is a date after the limit', done => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          before: '2018-03-01'
        }
      })

      datetime({
        schema,
        value: '2018-08-31'
      }).catch(error => {
        error.should.be.instanceOf(Error)

        done()
      })
    })

    it('should resolve if the input value is a date prior to the limit', () => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          before: '2018-03-01'
        }
      })

      return datetime({
        schema,
        value: '2018-01-01'
      })
    })

    it('should replace the `$now` placeholder with the current date', done => {
      let schema = Object.assign({}, mockSchema, {
        format: 'YYYY-MM-DD',
        validation: {
          before: '$now'
        }
      })
      let value = new Date()

      value.setMonth(value.getMonth() + 1)

      datetime({
        schema,
        value
      }).catch(error => {
        error.should.be.instanceOf(Error)

        value.setMonth(value.getMonth() - 2)

        datetime({
          schema,
          value
        }).then(done)
      })
    })
  })
})
