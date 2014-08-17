/**
 * [Wikipedia Webservice](http://www.geonames.org/export/wikipedia-webservice.html)
 *
 * The main 'geoname' table has the following fields :
 * ---------------------------------------------------
 *  lang	         :  ISO language code of article text
 *  title          :  the article title
 *  summary	       :  a short summary of the article text. Around 300 chars.
 *                    The text is truncated at a full stop if one is available near char 300, otherwise at the end of a word.
 *  feature	       :  the wikipedia feature type. A list of types is available here
 *  countryCode	   :  the ISO country code of the article
 *  elevation	     :  the elevation in metres (optional may be null), parsed from the article or reverse geocoded.
 *  population	   :  the population (optional may be null)
 *  lat            : 	latitude
 *  lng	           :  longitude
 *  wikipediaUrl	 :  URL of the article
 *  thumbnailImg	 :  URL of a small thumbnail image (ca 100x75 px)
 *  rank	         :  indication of the popularity or relevancy of an article.
 *                    The rank is an integer number from 1 for the least popular articles to 100 for the most popular articles.
 *                    It is calculated from the number of links pointing to an article and the article length.
 *                    The articles are more or less evenly distributed over the 100 ranks
 */

/**
 * [Wikipedia Features](http://www.geonames.org/wikipedia/wikipedia_features.html):
 *  1	  null
 *  2	  `white space`
 *  3	  city
 *  4   landmark
 *  5	  railwaystation
 *  6	  edu
 *  7	  adm2nd
 *  8	  waterbody
 *  9	  mountain
 *  10	airport
 *  11	isle
 *  12	river
 *  13	adm3rd
 *  14  adm1st
 *  15	event
 *  16  country
 *  17	glacier
 *  18  pass
 *  19	forest
 *  20	landscape
 *  21	church
 *  and others
 */

const FEATURE_COUNTRY = "country";
const FEATURE_ISLAND = "isle";
const FEATURE_CITY = "city";
const FEATURE_AIRPORT = "airport";
const FEATURE_ADM1 = "adm1st";
const FEATURE_ADM2 = "adm2nd";
const FEATURE_ADM3 = "adm3rd";
const FEATURE_ADM4 = "adm4th";
const FEATURE_ADM5 = "adm5th";

/**
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

function create() {
  return _.extend({}, require('./wiki.json'));
}

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

  if (!_.isEmpty(external) && external.title) {

    if (external.countryCode) {
      internal.countryIso = external.countryCode;
    }

    if (external.wikipediaUrl) {
      internal.link = external.wikipediaUrl;
    }
    if (external.thumbnailImg) {
      internal.picture = external.thumbnailImg;
    }

    if (external.summary) {
      internal.desc = external.summary;
    }

    if (external.geoNameId) {
      internal.geoNameId = external.geoNameId;
    }

    if (external.lat) {
      internal.latitude = external.lat;
    }
    if (external.lng) {
      internal.longitude = external.lng;
    }

    if (external.feature) {
      switch ((external.feature).toLowerCase()) {
        case FEATURE_COUNTRY:
          internal.country = external.title;
          break;
        case FEATURE_CITY:
          internal.city = external.title;
          break;
        case FEATURE_ISLAND:
        case FEATURE_AIRPORT:
        case FEATURE_ADM1:
        case FEATURE_ADM2:
        case FEATURE_ADM3:
        case FEATURE_ADM4:
        case FEATURE_ADM5:
          internal.admin = external.title;
          break;
        default:
          internal.place = external.title;
      }
    } else {
      internal.city = external.title;
    }

    return internal;
  }
}
