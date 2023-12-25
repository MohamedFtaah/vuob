var chai = require('chai');

var shuold = chai.should();
var expect = chai.expect;
var assert = chai.assert;

const request = require('supertest');
const app = require('../server');

const api = '/api/v1/medica/';


describe('GET /views', function() {
  it('return list of views', function(done) {
    request(app)
      .get(`${api}user/views`)
      .expect(200)
      .expect((res) => {
        console.log("views : " + JSON.stringify(res.body));
      }).end(done);
  })
})