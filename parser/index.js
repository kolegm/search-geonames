/**
 * [Doc Geonames API](http://www.geonames.org/export/webservice-exception.html)
 *
 * Error Code Description
 *  10 Authorization Exception
 *  11 record does not exist
 *  12 other error
 *  13 database timeout
 *  14 invalid parameter
 *  15 no result found
 *  16 duplicate exception
 *  17 postal code not found
 *  18 daily limit of credits exceeded
 *  19 hourly limit of credits exceeded
 *  20 weekly limit of credits exceeded
 *  21 invalid input
 *  22 server overloaded exception
 *  23 service not implemented
 *
 * Example :
 *   {"status": {
 *      "message": "we are afraid we could not find a administrative country subdivision for latitude and longitude :51.03,-20.0",
 *      "value": 15
 *   }}
 */

const STATUS_AUTH_EXCEPTION = '10';
const STATUS_RECORD_NOT_EXIST = '11';
const STATUS_OTHER_ERROR = '12';
const STATUS_DATABASE_TIMEOUT = '13';
const STATUS_INVALID_PARAMETER = '14';
const STATUS_NO_RESULT = '15';
const STATUS_DUPLICATE_PARAMETER = '16';
const STATUS_POSTAL_CODE_MANDATORY = '17';
const STATUS_DAILY_LIMIT = '18';
const STATUS_HOURLY_LIMIT = '19';
const STATUS_WEEKLY_LIMIT = '20';
const STATUS_INVALID_INPUT = '21';
const STATUS_SERVER_OVERLOAD = '22';
const STATUS_NOT_IMPLEMENTED = '23';

//--------------------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

var model = require('./model.json');

module.exports.parseError = function (error) {
  if (error && _.isObject(error)) {
    switch (error.code) {
      case 'ENOTFOUND':
        error.message = 'Connection refused.';
        break;
    }
  }
  return error;
};

/**
 * Results
 * When the geocoder returns results, it places them within a (JSON) results array.
 * Even if the geocoder returns no results (such as if the address doesn't exist) it still returns an empty results array.
 */
module.exports.parseData = function (data) {
  var result = [];

  if (_.isObject(data)) {
    // check status field
    if (data.status) {
      switch (data.status.value) {
        case STATUS_AUTH_EXCEPTION:
        case STATUS_RECORD_NOT_EXIST:
        case STATUS_OTHER_ERROR:
        case STATUS_DATABASE_TIMEOUT:
        case STATUS_INVALID_PARAMETER:
        case STATUS_NO_RESULT:
        case STATUS_DUPLICATE_PARAMETER:
        case STATUS_POSTAL_CODE_MANDATORY:
        case STATUS_DAILY_LIMIT:
        case STATUS_HOURLY_LIMIT:
        case STATUS_WEEKLY_LIMIT:
        case STATUS_INVALID_INPUT:
        case STATUS_SERVER_OVERLOAD:
        case STATUS_NOT_IMPLEMENTED:
        default:
      }
    } else {
      result = parse(data.geonames);
    }
  }

  return result;
};

/**
 * Convert external data format to internal format
 */
function parse (externalHolder) {
  var internalHolder = [];
  var internal;

  if (_.isArray(externalHolder)) {
    _.each(externalHolder, function (external) {
      internal = convert(external);
      internalHolder.push(internal);
    });
  }
  return internalHolder;
}

function convert (external) {
  var internal = create();

  if (!_.isEmpty(external)) {

  }

  return internal;
}

function create() {
  return _.extend({}, model);
}
