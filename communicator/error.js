var util = require('util');

const DEFAULT_MSSG = 'Geonames communication error';

function CommunicationError(message, constructorOptions) {
  Error.call(this); // super constructor
  Error.captureStackTrace(this, this.constructorOptions || this); // super helper method to include stack trace in error object

  this.name = this.constructor.name; // set our function’s name as error name.
  this.message = message || DEFAULT_MSSG; // set the error message
}

util.inherits(CommunicationError, Error);

module.exports = CommunicationError;
