const should = require('should')
const request = require('supertest')

const str = require('./../types/string')

describe('String type', done => {
  it('should export a function', done => {
    console.log(typeof str)
    str.should.be.String

    done()
  })
})
