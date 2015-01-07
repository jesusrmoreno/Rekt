/**
 * Rekt.js
 * Custom error declarations and handling.
 * Author = Jesus R. Moreno
 */

var util    = require('util');
var _       = require('lodash');

var exports   = {};
var internals = {};

internals.log = console.log;

/**
 * Easier Wrapper for the JSON.stringify
 *
 * @param   {Object}  obj  Object to convert to a string.
 * @return  {String}       Either the object as a string or an error message
 * saying we couldn't covert it.
 */
internals.stringify = function(obj) {
  try {
    return JSON.stringify(Error);
  }
  catch (err) {
    return '[Error converting to String' + err.message;
  }
};

var errors = {
  AssertError: 500,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthRequired: 407,
  ClientTimeout: 408,
  Conflict: 409,
  ResourceGone: 410
};

exports.wrap = function(errorName, error, statusCode) {
  exports[errorName] = error;
  exports[errorName].statusCode = statusCode || 500;
};

exports.setLogger = function(logCommand) {
  internals.log = logCommand;
};

/**
 * This function is used for asserting things to be true or false. If the
 * condition is true it simply return true, otherwise it throws an error with
 * the provided messages/Error
 *
 * @param   {Condition}  condition  The condition to test.
 * @return  {Boolean}               True if condition passes.
 */
exports.assert = function(condition) {
  var argv = arguments;
  if (condition) return true;
  if (argv.length === 2 && argv[1] instanceof Error) {
    throw argv[1];
  }
  var messages;
  messages = _.map(argv, function(message) {
    if (_.isString(message)) {
      return message;
    } else if (message instanceof Error) {
      return internals.stringify(message);
    } else {
      return undefined;
    }
  });
  messages = _.compact(messages);
  throw new exports.AssertError(messages.join(' ') || 'Unknown Error');
};

exports.createError = function(options, callback) {
  if (options.name) {
    var errorName = options.name;
    var status = options.status;
    exports[errorName] = function(message) {
      Error.captureStackTrace(this, exports[errorName]);
      this.name = errorName;
      this.status = status ? status : 500;
      this.message = message ? message : undefined;
    };
    exports[errorName].displayName = errorName;
    util.inherits(exports[errorName], Error);
    if (callback) {
      callback(null, exports[errorName]);
    }
  } else {
    var err = new TypeError('Name missing or invalid.');
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
};

/**
 * Handles user errors, we can usually reply to the user with the reason for
 * failure
 *
 * @param err The error object we threw This is not optional!
 * @param res Optional res object so that we can respond to the client
 */
exports.UserError = function(err, res) {
  if (res) {
    res.status(err.status);
    res.json({
      error: err.name,
      message: err.message
    });
  }
  internals.log(err);
};

/**
 * Handles non-fatal server errors, we can usually reply to the user so that
 * their request does not hang, does not crash the server. Should be used when
 * we are possibly expecting this error!
 *
 * @param err The error object we threw This is not optional!
 * @param res Optional res object so that we can respond to the client
 */
exports.ServerError = function(err, res) {
  internals.log(err);
  if (res) {
    res.status(err.status);
    res.send(err.message);
  }
};

/**
 * Handles fatal server errors, we can usually reply to the user so that their
 * request does not hang but we must crash the server otherwise our app is in
 * a unstable state and there may be other problems. Should be used when we
 * are NOT expecting this error!
 *
 * @param err The error object we threw This is not optional!
 * @param res Optional res object so that we can respond to the client
 */
exports.FatalServerError = function(err, res) {
  var message = [
    'Server Error, if this problem persists please contact the owners.'
  ].join('');
  if (res) {
    res.status(500);
    res.send(message);
  }
  process.kill(process.pid);
};

/**
 * Handles fatal server errors, we cannot reply to the user since we don't
 * know why this happened. Best course of action is to crash and let the
 * process manager resolve/restart it into a better known state.
 *
 * @param err The error we are going to log. This is not optional!
 */
exports.UncaughtFatalServerError = function(err) {
  var message = [
    'Server Error, if this problem persists please contact owners.'
  ].join('');
  internals.log(err);
  internals.log('Crash');
  process.kill(process.pid);
};



_.forEach(errors, function(status, name) {
  exports.createError({
    name: name,
    status: status
  });
});

module.exports = exports;
