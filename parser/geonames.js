/**
 * [Doc Geonames API](http://www.geonames.org/export/webservice-exception.html)
 * [README](http://download.geonames.org/export/dump/readme.txt)
 *
 * The main 'geoname' table has the following fields :
 * ---------------------------------------------------
 *  geonameid         : integer id of record in geonames database
 *  name              : name of geographical point (utf8) varchar(200)
 *  alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(8000)
 *  latitude          : latitude in decimal degrees (wgs84)
 *  longitude         : longitude in decimal degrees (wgs84)
 *  feature class     : see http://www.geonames.org/export/codes.html, char(1)
 *  feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
 *  country code      : ISO-3166 2-letter country code, 2 characters
 *  admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
 *  admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
 *  admin3 code       : code for third level administrative division, varchar(20)
 *  admin4 code       : code for fourth level administrative division, varchar(20)
 *  population        : bigint (8 byte int)
 *  elevation         : in meters, integer
 *  dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
 *  timezone          : the timezone id (see file timeZone.txt) varchar(40)
 *  modification date : date of last modification in yyyy-MM-dd format
 */

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

const TAG_ADMINISTRATIVE_BOUNDARY = "A"; // country, state, region,...
const TAG_HYDROGRAPHIC = "H"; // stream, lake, ...
const TAG_AREA = "L"; // parks,area, ...
const TAG_POPULATED_PLACE = "P"; // city, village,...
const TAG_ROAD_RAILROAD = "R"; // road, railroad
const TAG_SPOT = "S"; // spot, building, farm
const TAG_HYPSOGRAPHIC = "T"; // mountain, hill, rock,...
const TAG_UNDERSEA = "A"; // undersea
const TAG_VEGETATION = "V"; // forest, heath, ...

//--------------------------------------------------------------------------------------------------------------------------------
var _ = require('underscore');

function create() {
  return _.extend({}, require('./geonames.json'));
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

  if (!_.isEmpty(external) && external.fcl) {

    if (external.countryCode) {
      internal.countryIso = external.countryCode;
    }
    if (external.countryName) {
      internal.country = external.countryName;
    }

    var admin = [];
    var adminKey;
    for (i = 1; i <= 5; i ++) {
      adminKey = 'adminName' + i;
      if (!external[adminKey]) {
        break;
      }
      admin.push(external[adminKey]);
    }
    internal.admin = admin;

    switch ((external.fcl).toUpperCase()) {
      // country, state, region,...
      case TAG_ADMINISTRATIVE_BOUNDARY:
        // already parsed
        break;
      // city, village,...
      case TAG_POPULATED_PLACE:
        internal.city = external.name;
        break;
      // stream, lake, ...
      case TAG_HYDROGRAPHIC:
      // parks,area, ...
      case TAG_AREA:
      // road, railroad
      case TAG_ROAD_RAILROAD:
      // spot, building, farm
      case TAG_SPOT:
      // mountain, hill, rock,...
      case TAG_HYPSOGRAPHIC:
      // undersea
      case TAG_UNDERSEA:
      // forest, heath, ...
      case TAG_VEGETATION:
      default: // as place
        internal.place = external.name;
    }

    if (!_.isEmpty(external.alternateNames)) {
      var alts = [];
      _.each(external.alternateNames, function (alt) {
        if (!alt.name || !alt.lang) return;
        switch ((alt.lang).toLowerCase()) {
          case 'iata':
            internal.iata = alt.name;
            break;
          case 'icao':
            internal.icao = alt.name;
            break;
          case 'link':
            internal.link = alt.name;
            break;
          default:
            alts.push({
              key: alt.lang,
              value: alt.name
            });
        }
      });
      internal.alternate = alts;
    }

    if (external.lat) {
      internal.latitude = external.lat;
    }
    if (external.lng) {
      internal.longitude = external.lng;
    }
    if (external.bbox) {
      var bbox = external.bbox;

      var viewport = {
        leftTop: { latitude: null, longitude: null },
        rigthBottom: { latitude: null, longitude: null },
      }

      if (bbox.west) {
        viewport.leftTop.latitude = bbox.west;
      }
      if (bbox.north) {
        viewport.leftTop.longitude = bbox.north;
      }

      if (bbox.east) {
        viewport.rigthBottom.latitude = bbox.east;
      }
      if (bbox.south) {
        viewport.rigthBottom.longitude = bbox.south;
      }

      internal.viewport = viewport;
    }

    if (external.geonameId) {
      internal.geonameId = external.geonameId;
    }
  }

  return internal;
}
