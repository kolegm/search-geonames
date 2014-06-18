var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./communicator/parser');

/**
 * Wrapper - call Google geocoder and parse result
 */
function CommunicationWrapper() {}


CommunicationWrapper.prototype.extendCallback = function (callback) {
  return function (error, data) { 
    if (_.isFunction(callback)) {
      callback(error, Parser.process(data));
    }
  }
}

/**
 * @access public
 */
CommunicationWrapper.prototype.searchByQuery = function (query, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.searchByQuery(query, callback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.findNearBy = function (lat, lng, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.findNearBy(lat, lng, this.extendCallback(callback), options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.wikiSearchByQuery = function (query, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.wikiSearchByQuery(query, this.extendCallback(callback), options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.wikiFindNearBy = function (lat, lng, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.wikiFindNearBy(lat, lng, this.extendCallback(callback), options);
}

module.exports = new CommunicationWrapper();
