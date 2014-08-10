var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./parser');

/**
 * Wrapper - call Geonames geocoder and parse result
 */
function SearchWrapper() {}

SearchWrapper.prototype.extendCallback = function (callback) {
  return function (error, data) {
    error = Parser.parseError(error);
    data = Parser.parseData(data);

    if (_.isFunction(callback)) {
      callback(error, data);
    }
  }
}

/**
 * @access public
 */
SearchWrapper.prototype.searchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  var searcher = new Searcher();
  searcher.searchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.findNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  var searcher = new Searcher();
  searcher.findNearBy(lat, lng, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.wikiSearchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  var searcher = new Searcher();
  searcher.wikiSearchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
SearchWrapper.prototype.wikiFindNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  var searcher = new Searcher();
  searcher.wikiFindNearBy(lat, lng, extendedCallback, options);
}

module.exports = new SearchWrapper();
