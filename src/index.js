/**
 * Rekt.js
 * Custom error declarations and handling.
 *
 * Author: Jesus R. Moreno
 * Email:  jesusrmor94@gmail.com
 *         jesus.r.moreno.16@dartmouth.edu
 */

const util   = require('util');

/*
 * The Rekt class provides methods for easier managing of errors, and handlers
 * when building projects.
 */
class Rekt {

  /**
   * When called this function will create a new Rekt instance with the errors
   * contained in errors already initialized in order to provide common
   * default errors, these errors include but are not limited to the common
   * HTTP errors that are needed.
   *
   * @param   {Object}  opts  This is currently unused but remains in due to
   * convention.
   */
  constructor(opts) {

    const errors = {
      AssertError       : 500,
      BadRequest        : 400,
      Unauthorized      : 401,
      Forbidden         : 403,
      NotFound          : 404,
      MethodNotAllowed  : 405,
      NotAcceptable     : 406,
      ProxyAuthRequired : 407,
      ClientTimeout     : 408,
      Conflict          : 409,
      ResourceGone      : 410,
    };

    /* Initialize the default errors */
    Object.keys(errors).forEach((name) => {
      const status = errors[name];
      this.createError({
        name: name,
        status: status,
      });
    });

    /* Set the default logger to console.log */
    this.log = console.log;

    this.registeredHandlers = {
      AssertError: function(err) {
        console.log(err);
      }
    };
  }

  setHandler(name, command) {
    this.assert((typeof name == 'string' || name instanceof String));
    this.assert(
      Object.prototype.toString.call(callback) === '[object Function]'
    );
    this.registeredHandlers[name] = command;
  }

  handle(name, err) {
    this.assert((typeof name == 'string' || name instanceof String));
    this.assert(
      Object.prototype.toString.call(callback) === '[object Function]'
    );
    this.registeredHandlers[name](err);
  }

  /*
   * This function takes an options object and creates an Error in the rekt
   * class which can then be thrown or used by calling 'new rekt.ErrorName',
   * where ErrorName is the name of the error defined in the options object.
   *
   * When a status is defined in the opts object the error will be created
   * with that status, otherwise the default status is 500.
   *
   * @param   {Object}  opts  This object must contain a name key and
   * optionally a status key. The name key will be used as the displayName
   * when the error is thrown and the status is useful for HTTP errors.
   *
   * If no name is provided the function will throw an AssertError.
   */
  createError(opts) {

    const self = this;
    const name   = opts.name   || undefined;
    const status = opts.status || 500;

    this.assert((name !== undefined), new TypeError(
      'Cannot create unnamed error'
    ));

    this[name] = function(message) {
      Error.call(this);
      Error.captureStackTrace(this, self[name]);
      this.name    = name;
      this.status  = status;
      this.message = message;
      this.isRekt  = true;
    };

    util.inherits(this[name], Error);
  }

  /*
   * Provides a helper function for making sure that a statement is true. When
   * passed an error it will throw that error if the provided statement is
   * false, if provided a string it will throw an AssertError with that string
   * as the message, otherwise it will throw an AssertError with the message,
   * 'Assert Error'
   */
  assert(...conditions) {

    /**
     * We get our condition statement and our error object if it exists and we
     * assume that the last argument is a callback. We will check this if/when
     * we return an error.
     */
    const [condition, error] = conditions;
    const callback = conditions[conditions.length - 1];

    /**
     * If the condition evaluates to true we simply return true.
     */
    if (condition) return true;

    /**
     * If the condition did not evaluate to true and we were given an error to
     * throw we throw that error.
     */
    if (error && error instanceof Error) {
      throw error;
    }

    /**
     * If we are not given an error object then we loop through the rest of
     * the arguments finding any strings and returning them.
     */
    let messages = conditions.map((message) => {
      if (typeof message == 'string' || message instanceof String) {
        return message;
      } else if (message instanceof Error) {
        try {
          return JSON.stringify(Error);
        }
        catch (err) {
          return '[Error converting to String' + err.message;
        }
      } else {
        return undefined;
      }
    });

    /**
     * We get rid of anything that wasn't a string.
     */
    messages = messages.filter((message) => {
      if (message === undefined) {
        return false;
      } else {
        return true;
      }
    });

    /** If we have messages then we join them otherwise use 'Assert Error' */
    const err = new this.AssertError(messages.join(' ') || 'Assert Error');

    /**
     * Check if our callback is indeed a function and call it with the err.
     * otherwise we throw our new error.
     */
    if (Object.prototype.toString.call(callback) === '[object Function]') {
      callback(err);
    } else {
      throw err;
    }
  }
}


const rekt = new Rekt();

module.exports = {
  rekt: rekt,
  local: Rekt,
};





