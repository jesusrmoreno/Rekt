
# Rekt

# Usage
```
/* For a preinstantiated instance */
var rekt = require('rekt').rekt; // Changes to this instance will persist when required elsewhere.

/* For a when you want to initialize a local rekt instance */
var Rekt = require('rekt').Rekt;

/* Changes to one instance will not affect the other. */
var rekt1 = new Rekt();
var rekt2 = new Rekt();
```

## Creating new Errors
```
var rekt = require('rekt').rekt;

rekt.createError({
    name: 'NewError', // must be included, will throw error if not included.
    status: 400 // defaults to 500
});

throw new rekt.NewError('This is the message that will show up');
```

## Setting and Using handlers
```
var rekt = require('rekt').rekt;

// Name must a string and must be be an existing error.
// the callback will receive the error object
rekt.setHandler('ErrorName', function(err) {
    console.log(err);
    // etc...
});

/**
 * rekt.handle('ErrorName') takes the name of an error and calls the
 * callback associated with that errorname.
 */

var err = new rekt.ErrorName('This is false');
rekt.assert(false, err, rekt.handle('ErrorName'));
```



## Assert
```
var rekt = require('rekt').rekt;

// will throw AssertError with provided message.
rekt.assert(false, 'This statement is false'); 

// will call the callback with the error object.
rekt.assert(false, 'This statement is false', function(err) {
    console.log(err);
    // etc...
});

// Will throw the given error.
rekt.createError({ name: 'NewError', status: 500 });
var err = new rekt.NewError('New Error Message');
rekt.assert(false, NewError)

// Will pass the given error to the callback
rekt.createError({ name: 'NewError', status: 500 });
var err = new rekt.NewError('New Error Message');
rekt.assert(false, NewError, function(err) {
    console.log(err.name); // would be 'NewError';
    // etc...
});
```

