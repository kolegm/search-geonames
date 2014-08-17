var util = require('util');

var communicator = require('./');

const ADDRESS = process.argv[2] || 'Belgium, Antwerp';
const LATITUDE = '51.216667';
const LONGITUDE = '4.4';
const LANGUAGE = 'en';

var options = {
  language: LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  else console.log(util.inspect(result, {depth: 5}));
}

communicator.searchByQuery(ADDRESS, callback, options);
communicator.findNearBy(LATITUDE, LONGITUDE, callback, options);

communicator.wikiSearchByQuery(ADDRESS, callback, options);
communicator.wikiFindNearBy(LATITUDE, LONGITUDE, callback, options);
