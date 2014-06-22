/**
 * @todo use mocha test
 */
var communicator = require('./index');

const ADDRESS = 'Kyiv';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

var options = {
  language: LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  else console.log(result);
}

communicator.searchByQuery(ADDRESS, callback, options);
communicator.findNearBy(LATITUDE, LONGITUDE, callback, options);

communicator.wikiSearchByQuery(ADDRESS, callback, options);
communicator.wikiFindNearBy(LATITUDE, LONGITUDE, callback, options);
