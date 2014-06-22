var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./communicator/parser');

/**
 * Wrapper - call Google geocoder and parse result
 */
function CommunicationWrapper() {}

CommunicationWrapper.prototype.extendCallback = function (callback) {
  return function (error, data) { 
    (error)
      ? Parser.emit('parse_error', error)
      : Parser.emit('parse_data', data);
    
    if (_.isFunction(callback)) {
      callback(error, data);
    }
  }
}

/**
 * @access public
 */
CommunicationWrapper.prototype.searchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.searchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.findNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.findNearBy(lat, lng, extendedCallback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.wikiSearchByQuery = function (query, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.wikiSearchByQuery(query, extendedCallback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.wikiFindNearBy = function (lat, lng, callback, options) {
  var extendedCallback = this.extendCallback(callback);
  Searcher.wikiFindNearBy(lat, lng, extendedCallback, options);
}

module.exports = new CommunicationWrapper();
