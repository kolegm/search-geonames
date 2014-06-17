/**
 * @todo use mocha test
 */
var communicator = require('./index');

const ADDRESS = 'Kyiv';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

function callback (error, result) {
  if (error) console.log(error);
  console.log(result);
}

console.log('search process');
console.log('result in language: ' + LANGUAGE);
console.log('by address: ' + ADDRESS);
console.log('by geo coords: ' + LATITUDE + ', ' + LONGITUDE);

communicator.searchByQuery(
  ADDRESS, 
  callback,
  { language: LANGUAGE }
);

communicator.findNearBy(
  LATITUDE, 
  LONGITUDE,
  callback,
  { language: LANGUAGE }
);

communicator.wikiSearchByQuery(
  ADDRESS, 
  callback,
  { language: LANGUAGE }
);

communicator.wikiFindNearBy(
  LATITUDE, 
  LONGITUDE,
  callback,
  { language: LANGUAGE }
);

