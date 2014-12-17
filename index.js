/**
 * Rekt.js
 * Custom error declarations and handling.
 * Author = Jesus R. Moreno
 */

var util = require('util');
var _    = require('lodash');
var rekt = {};

var errors = {
    BadRequest        : 400,
    Unauthorized      : 401,
    Forbidden         : 403,
    NotFound          : 404,
    MethodNotAllowed  : 405,
    NotAcceptable     : 406,
    ProxyAuthRequired : 407,
    ClientTimeout     : 408,
    Conflict          : 409,
    ResourceGone      : 410
};

rekt.createError = function(options, callback) {
    if (options.name) {
        var errorName = options.name;
        var status    = options.status;
        rekt[errorName] = function (message) {
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

_.forEach(errors, function(status, name) {
    rekt.createError({
        name: name,
        status: status
    });
});

module.exports = rekt;



