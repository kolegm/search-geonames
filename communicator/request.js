/**
 * [Doc Geonames API - search by query](http://www.geonames.org/export/geonames-search.html)
 * [Example](http://api.geonames.org/searchJSON?q=kyiv&username=kolegm&isNameRequired=true&style=LONG&fuzzy=0.8&maxRows=10)
 *
 * [Doc Geonames API - findNearBy / reverse geocoding](http://www.geonames.org/export/web-services.html#findNearby)
 * [Example](http://api.geonames.org/findNearbyJSON?lat=47.3&lng=9&username=kolegm&style=LONG)
 *
 * [Doc Geonames API - Wikipedia fulltext search ] (http://www.geonames.org/export/wikipedia-webservice.html#wikipediaSearch)
 * [Example](Example: http://api.geonames.org/wikipediaSearchJSON?q=london&username=kolegm&maxRows=10)
 *
 * [Doc Geonames API - find nerby Wikipedia Entries / reverse geocoding ] (http://www.geonames.org/export/wikipedia-webservice.html#findNearbyWikipedia)
 * [Example](http://api.geonames.org/findNearbyWikipediaJSON?lat=47&lng=9&username=kolegm)
 */

var request = require("request");
var util = require("util");
var _ = require('underscore');

var CommunicationError = require('./error');
var config = require('./config.json');

/**
 * Constructor
 */
function Searcher() {
  this._initDefaultOptions();
}

/**
 * @access public
 */
Searcher.prototype.searchByQuery = function (query, callback, options) {
  query = (query).toString();
  if (!query.length) {
    return callback(
      new CommunicationError("Query parameter is mandatory.")
    );
  }

  this._useExternalMethod('searchByQuery');

  options = _.extend(
    { q: query },
    (options || {})
  );
  this._useOptions(options);
  
  this._send(callback);
};

/**
 * @access public
 */
Searcher.prototype.findNearBy = function (lat, lng, callback, options) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  
  if (!lat || !lng) {
    return callback(
      new CommunicationError("Geographical coordinates are mandatory.")
    );
  }

  this._useExternalMethod('findNearBy');

  options = _.extend(
    { lat: lat, lng: lng },
    (options || {})
  );
  this._useOptions(options);

  this._send(callback);
};

/**
 * @access public
 */
Searcher.prototype.wikiSearchByQuery = function (query, callback, options) {
  query = (query).toString();
  if (!query.length) {
    return callback(
      new CommunicationError("Query parameter is mandatory.")
    );
  }

  this._useExternalMethod('wikiSearchByQuery');

  options = _.extend(
    { q: query },
    (options || {})
  );
  this._useOptions(options);
  
  this._send(callback);
};

/**
 * @access public
 */
Searcher.prototype.wikiFindNearBy = function (lat, lng, callback, options) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  
  if (!lat || !lng) {
    return callback(
      new CommunicationError("Geographical coordinates are mandatory.")
    );
  }
  
  this._useExternalMethod('wikiFindNearBy');

  options = _.extend(
    { lat: lat, lng: lng },
    (options || {})
  );
  this._useOptions(options);

  this._send(callback);
};

/**
 * @access protected
 */
Searcher.prototype._send = function (callback) {
  try {
    request({
      uri: (this._getUri() + this._getMethod()),
      qs: this._getOptions()
    }, function (error, response, body) {
      if (error) {
        return callback(error);
      } else {
        callback(null, JSON.parse(body));
      }
    });
  } catch (error) {
    return callback(error);
  }
}

/**
 * @access protected
 */
Searcher.prototype._getUri = function () {
  if (!this._checkUri()) {
    this._initUri();
  }

  this._checkUriWithError();
  
  return this.uri;
}

/**
 * @access protected
 */
Searcher.prototype._initUri = function () {
  this.uri = config['uri'];
}

/**
 * @access protected
 */
Searcher.prototype._checkUri = function () {
  return (this.uri && this.uri.length);
}

/**
 * @access protected
 */
Searcher.prototype._checkUriWithError = function () {
  if (!this._checkUri()) {
    throw new CommunicationError("Uri is not valid.")
  }
  return true;
}

/**
 * @access protected
 */
Searcher.prototype._useExternalMethod = function (methodName) {
  methodName = (methodName).toString();
  method = config[methodName];
  
  if (!method) {
    throw new CommunicationError(util.format(
      'Method mapping %sis incorrect.',
      (methodName) ? util.format('for internal method \'%s\' ', methodName) : ''
    ));
  }

  this.method = method;
}

/**
 * @access protected
 */
Searcher.prototype._getMethod = function () {
  this._checkMethodWithError();
  return this.method;
}

/**
 * @access protected
 */
Searcher.prototype._checkMethod = function () {
  return (this.method && this.method.length);
}

/**
 * @access protected
 */
Searcher.prototype._checkMethodWithError = function () {
  if (!this._checkMethod()) {
    throw new CommunicationError("Method is not valid.")
  }
  return true;
}

/**
 * @access protected
 */
Searcher.prototype._useOptions = function (options) {
  this.options = _.extend({}, this.defaultOptions);
  _.extend(this.options, (options || {}));
}

/**
 * @access protected
 */
Searcher.prototype._initDefaultOptions = function () {
  this.defaultOptions = _.extend({}, config['options'] || {});
}

/**
 * @access protected
 */
Searcher.prototype._getOptions = function () {
  return this.options;
}

module.exports = new Searcher();
