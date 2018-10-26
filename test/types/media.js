const should = require('should')
const request = require('supertest')

const media = require('./../../types/media')

const mockSchema = {
  type: 'media'
}

describe('Media type', done => {
  it('should export a function', () => {
    (typeof media).should.eql('function')
  })

  describe('Single value', () => {
    it('should reject if the input value is not a hexadecimal string or object with an hexadecimal _id', done => {
      media({
        schema: mockSchema,
        value: 123456
      }).catch(error => {
        error.should.be.instanceOf(Error)

        media({
          schema: mockSchema,
          value: {
            someProperty: '123456'
          }
        }).catch(error => {
          error.should.be.instanceOf(Error)

          media({
            schema: mockSchema,
            value: {
              _id: '123456ZY'
            }
          }).catch(error => {
            error.should.be.instanceOf(Error)

            done()
          })
        })
      })
    })

    it('should resolve if the input value is a hexadecimal string', () => {
      return media({
        schema: mockSchema,
        value: '5bd1c08a7a39d56eb0af7c1d'
      })
    })

    it('should resolve if the input value is an object with an hexadecimal _id', () => {
      return media({
        schema: mockSchema,
        value: {
          _id: '5bd1c08a7a39d56eb0af7c1d'
        }
      })
    })

    it('should resolve if the input value is an object with an hexadecimal _id plus additional properties', () => {
      return media({
        schema: mockSchema,
        value: {
          _id: '5bd1c08a7a39d56eb0af7c1d',
          altText: 'Lorem ipsum',
          crop: [16, 32, 64, 128]
        }
      })
    })
  })

  describe('Multi-value', () => {
    it('should reject if the input array contains a value that is not a hexadecimal string or object with an hexadecimal _id', done => {
      media({
        schema: mockSchema,
        value: ['5bd1c08a7a39d56eb0af7c1d', 123456]
      }).catch(error => {
        error.should.be.instanceOf(Error)

        media({
          schema: mockSchema,
          value: [
            '5bd1c08a7a39d56eb0af7c1d',
            {
              someProperty: '123456'
            }
          ]
        }).catch(error => {
          error.should.be.instanceOf(Error)

          media({
            schema: mockSchema,
            value: [
              '5bd1c08a7a39d56eb0af7c1d',
              {
                _id: '123456ZY'
              }
            ]
          }).catch(error => {
            error.should.be.instanceOf(Error)

            done()
          })
        })
      })
    })

    it('should resolve if the input array contains valid values', () => {
      return media({
        schema: mockSchema,
        value: [
          '5bd1c08a7a39d56eb0af7c1d',
          {
            _id: '5bd1c08a7a39d56eb0af7c1d'
          },
          {
            _id: '5bd1c08a7a39d56eb0af7c1d',
            altText: 'Lorem ipsum',
            crop: [16, 32, 64, 128]
          }
        ]
      })
    })
  })
})
