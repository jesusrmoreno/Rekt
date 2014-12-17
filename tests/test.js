var expect = require('chai').expect;
var rekt   = require('../rewrite.js');
describe('Rekt', function() {
  it('Should be intialized properly', function() {
    expect(rekt).to.be.an('object');
    var keys = [
      'createError',
      'BadRequest',
      'ClientTimeout',
      'Conflict',
      'Forbidden',
      'MethodNotAllowed',
      'NotAcceptable',
      'NotFound',
      'ProxyAuthRequired',
      'ResourceGone',
      'Unauthorized'
    ]
    expect(rekt).to.have.keys(keys);
  });
  
  it('Should create a new error when given both status and name', function() {
    rekt.createError({
      name: 'TestError',
      status: 800
    });
    expect(rekt).to.include.key('TestError');
  });

  it('Should be able to use that error', function() {
    var throwTest = function() {
      throw new rekt.TestError();
    }
    expect(throwTest).to.throw(rekt.TestError);
  });
  
  it('Should fail to create error when not given name', function() {
    expect(rekt.createError).to.throw(TypeError);
  });
})