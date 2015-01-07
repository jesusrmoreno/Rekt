var expect = require('chai').expect;
var rekt   = require('../index.js');
describe('Rekt', function() {
  it('Should be intialized properly', function() {
    expect(rekt).to.be.an('object');
    var keys = [
      'AssertError',
      'createError',
      'BadRequest',
      'ClientTimeout',
      'Conflict',
      'Forbidden',
      'MethodNotAllowed',
      'NotAcceptable',
      'NotFound',
      'ProxyAuthRequired',
      'FatalServerError',
      'ServerError',
      'UncaughtFatalServerError',
      'UserError',
      'ResourceGone',
      'Unauthorized',
      'assert',
      'setLogger'
    ];
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
      throw new rekt.TestError('Hello');
    };

    // console.log(throwTest());
    expect(throwTest).to.throw(rekt.TestError());
  });

  it('Should fail to create error when not given name', function() {
    expect(rekt.createError).to.throw(TypeError);
  });

  it('Should return true when assertation is true', function() {
    expect(rekt.assert(2 === 2)).to.equal(true);
  });

  it('Should throw when assertation is false', function() {
    var assertTest = function() {
      rekt.assert(2 !== 2, 'This is a test!');
    };
    expect(assertTest).to.throw(rekt.AssertError());
  });
});
