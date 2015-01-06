/**
 * Rekt.js
 * Custom error declarations and handling.
 * Author = Jesus R. Moreno
 */

var util = require('util');
var _    = require('lodash');
var rekt = {};

/**
 * Easier Wrapper for the JSON.stringify
 *
 * @param   {Object}  obj  Object to convert to a string.
 * @return  {String}       Either the object as a string or an error message
 * saying we couldn't covert it.
 */
function stringify(obj) {
  try {
    return JSON.stringify(Error);
  }
  catch (err) {
    return '[Error converting to String' + err.message;
  }
}

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

rekt.wrap = function(errorName, error, statusCode) {
  rekt[errorName] = error;
  rekt[errorName].statusCode = statusCode || 500;
};

/**
 * This function is used for asserting things to be true or false. If the
 * condition is true it simply return true, otherwise it throws an error with
 * the provided messages/Error
 *
 * @param   {Condition}  condition  The condition to test.
 * @return  {Boolean}               True if condition passes.
 */
rekt.assert = function(condition) {
  var argv = arguments;
  if (condition) return true;
  if (argv.length === 2 && argv[1] instanceof Error) {
    throw argv[1];
  }
  var messages;
  messages = _.filter(argv, function(arg) {
    if (arg !== '') {
      return true;
    } else {
      return false;
    }
  });
  messages = _.map(messages, function(message) {
    if (_.isString(message)) {
      return message;
    } else if (message instanceof Error) {
      stringify(message);
    }
  });
  throw rekt.AssertError(messages.join(' ') || 'Unknown Error');
};

rekt.createError = function(options, callback) {
  if (options.name) {
    var errorName = options.name;
    var status = options.status;
    rekt[errorName] = function(message) {
      Error.captureStackTrace(this, rekt[errorName]);
      this.name = errorName;
      this.status = status ? status : 500;
      this.message = message ? message : undefined;
    };
    rekt[errorName].displayName = errorName;
    util.inherits(rekt[errorName], Error);
    if (callback) {
      callback(null, rekt[errorName]);
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
rekt.UserError = function(err, res) {
  console.log(err);
  if (res) {
    res.status(err.status);
    res.json({
      error: err.name,
      message: err.message
    });
  }
  log.user(err);
};

/**
 * Handles non-fatal server errors, we can usually reply to the user so that
 * their request does not hang, does not crash the server. Should be used when
 * we are possibly expecting this error!
 *
 * @param err The error object we threw This is not optional!
 * @param res Optional res object so that we can respond to the client
 */
rekt.ServerError = function(err, res) {
  log.error(err);
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
rekt.FatalServerError = function(err, res) {
  var message = [
    'Server Error, if this problem persists please contact Tiltfactor.'
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
rekt.UncaughtFatalServerError = function(err) {
  var message = [
    'Server Error, if this problem persists please contact Tiltfactor.'
  ].join('');
  log.fatal(err);
  log.status('Crash');
  process.kill(process.pid);
};

_.forEach(errors, function(status, name) {
  rekt.createError({
    name: name,
    status: status
  });
});

module.exports = rekt;
