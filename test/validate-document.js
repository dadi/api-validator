const Validator = require('./../index')

const mockSchema = {
  title: {
    type: 'string',
    required: true,
    validation: {
      minLength: 10
    }
  },
  revision: {
    type: 'number',
    validation: {
      greaterThan: 0,
      integer: true
    }
  },
  publishedAt: {
    type: 'datetime',
    validation: {
      lessThan: '$now'
    }
  }
}

describe('validateDocument', () => {
  it('should reject when a required field is missing', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          revision: 10
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(1)

        error[0].field.should.eql('title')
        error[0].code.should.eql('ERROR_REQUIRED')
        error[0].message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when a field fails the validation rules', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          title: 'hello world',
          revision: 12.3
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(1)

        error[0].field.should.eql('revision')
        error[0].code.should.eql('ERROR_INTEGER')
        error[0].message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when a field is not part of the schema', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          title: 'hello world',
          revision: 12,
          author: 'Eduardo'
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(1)

        error[0].field.should.eql('author')
        error[0].code.should.eql('ERROR_NOT_IN_SCHEMA')
        error[0].message.should.be.instanceof(String)

        done()
      })
  })

  it('should treat a language variaton of a field in the same way as the canonical one (using default)', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          title: 'hello',
          'title:pt': 'ola',
          'title:fr': 'bonjour',
          'title:kr': 'annyeonghaseyo',
          revision: 1
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(3)

        error[0].field.should.eql('title')
        error[0].code.should.eql('ERROR_MIN_LENGTH')
        error[0].message.should.be.instanceof(String)

        error[1].field.should.eql('title:pt')
        error[1].code.should.eql('ERROR_MIN_LENGTH')
        error[1].message.should.be.instanceof(String)

        error[2].field.should.eql('title:fr')
        error[2].code.should.eql('ERROR_MIN_LENGTH')
        error[2].message.should.be.instanceof(String)

        done()
      })
  })

  it('should treat a language variaton of a field in the same way as the canonical one (using custom)', done => {
    const validator = new Validator({
      i18nFieldCharacter: '='
    })

    validator
      .validateDocument({
        document: {
          title: 'hello',
          'title=pt': 'ola',
          'title=fr': 'bonjour',
          'title=kr': 'annyeonghaseyo',
          revision: 1
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(3)

        error[0].field.should.eql('title')
        error[0].code.should.eql('ERROR_MIN_LENGTH')
        error[0].message.should.be.instanceof(String)

        error[1].field.should.eql('title=pt')
        error[1].code.should.eql('ERROR_MIN_LENGTH')
        error[1].message.should.be.instanceof(String)

        error[2].field.should.eql('title=fr')
        error[2].code.should.eql('ERROR_MIN_LENGTH')
        error[2].message.should.be.instanceof(String)

        done()
      })
  })

  it('should add error information for all fields that failed validation', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          title: 'hello',
          revision: 12.3
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(2)

        error[0].field.should.eql('title')
        error[0].code.should.eql('ERROR_MIN_LENGTH')
        error[0].message.should.be.instanceof(String)

        error[1].field.should.eql('revision')
        error[1].code.should.eql('ERROR_INTEGER')
        error[1].message.should.be.instanceof(String)

        done()
      })
  })

  it('should not reject when a non-required field is missing from the payload', () => {
    const validator = new Validator()

    return validator.validateDocument({
      document: {
        title: 'hello world',
        revision: 12
      },
      schema: mockSchema
    })
  })

  it('should not reject when a non-required field is set to null', () => {
    const validator = new Validator()

    return validator.validateDocument({
      document: {
        title: 'hello world',
        revision: null,
        publishedAt: null
      },
      schema: mockSchema
    })
  })

  it('should not reject when a required field is missing from the payload and `isUpdate: true`', () => {
    const validator = new Validator()

    return validator.validateDocument({
      document: {
        revision: 12
      },
      isUpdate: true,
      schema: mockSchema
    })
  })

  it('should reject when a required field is set to null', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          title: null
        },
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(1)
        error[0].code.should.eql('ERROR_REQUIRED')
        error[0].message.should.be.instanceof(String)

        done()
      })
  })

  it('should reject when a field fails the validation rules and `isUpdate: true`', done => {
    const validator = new Validator()

    validator
      .validateDocument({
        document: {
          revision: 12.3
        },
        isUpdate: true,
        schema: mockSchema
      })
      .catch(error => {
        error.should.be.instanceof(Array)
        error.length.should.eql(1)

        error[0].field.should.eql('revision')
        error[0].code.should.eql('ERROR_INTEGER')
        error[0].message.should.be.instanceof(String)

        done()
      })
  })
})
