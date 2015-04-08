"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Rekt.js
 * Custom error declarations and handling.
 *
 * Author: Jesus R. Moreno
 * Email:  jesusrmor94@gmail.com
 *         jesus.r.moreno.16@dartmouth.edu
 */

var util = require("util");

/**
 * The Rekt class provides methods for easier managing of errors, and handlers
 * when building projects.
 */

var Rekt = (function () {

  /**
   * When called this function will create a new Rekt instance with the errors
   * contained in errors already initialized in order to provide common
   * default errors, these errors include but are not limited to the common
   * HTTP errors that are needed.
   *
   * @param   {Object}  opts  This is currently unused but remains in due to
   * convention.
   */

  function Rekt(opts) {
    var _this = this;

    _classCallCheck(this, Rekt);

    _get(Object.getPrototypeOf(Rekt.prototype), "constructor", this).call(this);
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
      ResourceGone: 410 };

    /** Initialize the default errors */
    Object.keys(errors).forEach(function (name) {
      var status = errors[name];
      _this.createError({
        name: name,
        status: status });
    });

    /** Set the default logger to console.log */
    this.log = console.log;
  }

  _createClass(Rekt, {
    setLogger: {

      /**
       * This function provides a way to alias a logger if so desired, this is not
       * necessary and remains as an aid.
       *
       * @param  {function}  command  The log function to be used.
       */

      value: function setLogger(command) {
        this.log = command;
      }
    },
    createError: {

      /**
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

      value: function createError(opts) {

        var self = this;
        var name = opts.name || undefined;
        var status = opts.status || 500;

        this.assert(name !== undefined, new TypeError("Cannot create unnamed error"));

        this[name] = function (message) {
          Error.call(this);
          Error.captureStackTrace(this, self[name]);
          this.name = name;
          this.status = status;
          this.message = message;
          this.isRekt = true;
        };

        util.inherits(this[name], Error);
      }
    },
    assert: {

      /**
       * Provides a helper function for making sure that a statement is true. When
       * passed an error it will throw that error if the provided statement is
       * false, if provided a string it will throw an AssertError with that string
       * as the message, otherwise it will throw an AssertError with the message,
       * 'Assert Error'
       */

      value: function assert() {
        for (var _len = arguments.length, conditions = Array(_len), _key = 0; _key < _len; _key++) {
          conditions[_key] = arguments[_key];
        }

        var condition = conditions[0];
        var error = conditions[1];

        if (condition) {
          return true;
        }if (error && error instanceof Error) {
          throw error;
        }

        var messages = conditions.map(function (message) {
          if (typeof message == "string" || message instanceof String) {
            return message;
          } else if (message instanceof Error) {
            try {
              return JSON.stringify(Error);
            } catch (err) {
              return "[Error converting to String" + err.message;
            }
          } else {
            return undefined;
          }
        });

        messages = messages.filter(function (message) {
          if (message === undefined) {
            return false;
          } else {
            return true;
          }
        });

        var err = new Error(messages.join(" ") || "Assert Error");
        throw err;
      }
    }
  });

  return Rekt;
})();

var rekt = new Rekt();

module.exports = rekt;
