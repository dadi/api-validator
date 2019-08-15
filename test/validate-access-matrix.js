const should = require('should')
const Validator = require('./../index')

describe('validateAccessMatrix', () => {
  it('should reject when the value is not an object', done => {
    const validator = new Validator()

    validator.validateAccessMatrix('not-an-object').catch(errors => {
      const [error] = errors

      error.code.should.eql('ERROR_INVALID_ACCESS_MATRIX')
      error.message.should.be.instanceof(String)
      should.not.exist(error.field)

      validator
        .validateAccessMatrix('not-an-object', 'someField')
        .catch(errors => {
          const [error] = errors

          error.code.should.eql('ERROR_INVALID_ACCESS_MATRIX')
          error.message.should.be.instanceof(String)
          error.field.should.eql('someField')

          done()
        })
    })
  })

  it('should reject when the matrix contains an invalid access type', done => {
    const validator = new Validator()

    validator
      .validateAccessMatrix({
        create: true,
        notAThing: true
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_ACCESS_TYPE')
        error.field.should.eql('notAThing')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when the matrix contains an invalid access value', done => {
    const validator = new Validator()

    validator
      .validateAccessMatrix({
        create: 1234
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_ACCESS_VALUE')
        error.field.should.eql('create')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when one of the access values is an object with an invalid key', done => {
    const validator = new Validator()

    validator
      .validateAccessMatrix({
        create: {
          filter: {
            someField: 1
          }
        },
        update: {
          notAThing: {
            someField: 0
          }
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_ACCESS_VALUE')
        error.field.should.eql('update.notAThing')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when one of the access values is an object with an invalid value', done => {
    const validator = new Validator()

    validator
      .validateAccessMatrix({
        create: {
          filter: 123
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_ACCESS_VALUE')
        error.field.should.eql('create.filter')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when one of the access values is an object with an invalid field projection', done => {
    const validator = new Validator()

    validator
      .validateAccessMatrix({
        create: {
          fields: {
            field1: 1,
            field2: 0
          }
        }
      })
      .catch(errors => {
        const [error] = errors

        error.code.should.eql('ERROR_INVALID_ACCESS_VALUE')
        error.field.should.eql('create.fields')
        error.message.should.be.instanceof(String)

        done()
      })
  })

  it('should resolve when the value is a valid access matrix', () => {
    const validator = new Validator()

    return validator.validateAccessMatrix({
      create: {
        fields: {
          field1: 1,
          field2: 1
        }
      },
      deleteOwn: true,
      delete: false,
      update: {
        filter: {
          someField: {
            $ne: 'someValue'
          }
        }
      },
      read: false
    })
  })
})
