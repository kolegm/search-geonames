var _ = require('underscore');

var Searcher = require('./communicator/request');

/**
 * Wrapper - call Geonames geocoder and parse result
 */
function SearchWrapper() {}

SearchWrapper.prototype.extendGeonamesCallback = function (callback) {
  var ParserGeonames = require('./parser/geonames');
  return function (error, data) {
    error = ParserGeonames.parseError(error);
    data = ParserGeonames.parseData(data);

    if (_.isFunction(callback)) {
      callback(error, data);
    }
  }
}

SearchWrapper.prototype.extendWikiCallback = function (callback) {
  var ParserWiki = require('./parser/wiki');
  return function (error, data) {
    error = ParserWiki.parseError(error);
    data = ParserWiki.parseData(data);

    if (_.isFunction(callback)) {
      callback(error, data);
    }
  }
}

/**
 * @access public
 */
SearchWrapper.prototype.searchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendGeonamesCallback(callback);
  var searcher = new Searcher();
  searcher.searchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.findNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendGeonamesCallback(callback);
  var searcher = new Searcher();
  searcher.findNearBy(lat, lng, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.wikiSearchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendWikiCallback(callback);
  var searcher = new Searcher();
  searcher.wikiSearchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.wikiFindNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendWikiCallback(callback);
  var searcher = new Searcher();
  searcher.wikiFindNearBy(lat, lng, extendedCallback, options);
}

module.exports = new SearchWrapper();
