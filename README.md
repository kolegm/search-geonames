##search-geonames

### General
Node.js module for geocoding and reverse geocoding.  

Geocoding. Geonames API - [search by query](http://www.geonames.org/export/geonames-search.html).
It is the process of matching address with geographic coordinates.
[Response example](http://api.geonames.org/findNearbyJSON?lat=47.3&lng=9&username=demo&style=LONG).  
Reverse Geocoding. Geonames API - [findNearBy](http://www.geonames.org/export/web-services.html#findNearby)
It is the process of matching geographic coordinates with address.
[Response example](http://api.geonames.org/findNearbyJSON?lat=47.3&lng=9&username=demo&style=LONG).  
Wikipedia, search data by query about location. Geonames API - [Wikipedia fulltext search](http://www.geonames.org/export/wikipedia-webservice.html#wikipediaSearch).
[Response example](http://api.geonames.org/wikipediaSearchJSON?q=london&username=demo&maxRows=10).  
Wikipedia, search data by coordinates about location. Geonames API - [find nerby Wikipedia Entries](http://www.geonames.org/export/wikipedia-webservice.html#findNearbyWikipedia).
[Response example](http://api.geonames.org/findNearbyWikipediaJSON?lat=47&lng=9&username=demo).  

Output format like JSON.

[Description](http://www.geonames.org/export/#ws)

### Installation
>npm install search-geonames [-S]

### Usage example
```javascript
// initialize geocoder instance
var geonames = require('search-geonames');

// request parameters
const ADDRESS = 'Kyiv, Khreshchatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

// you can use Google options to manage result format
var options = {
  language: LANGUAGE
};

// use callback to return result from geocoding process
function callback (error, result) {
  if (error) console.log(error); // on error
  else console.log(result); // on success
}

// address geocoding
geonames.searchByQuery(ADDRESS, callback, options);
// reverse geocoding
geonames.findNearBy(LATITUDE, LONGITUDE, callback, options);
// get wiki data by address
communicator.wikiSearchByQuery(ADDRESS, callback, options);
// get wiki data by geographic coordinates
communicator.wikiFindNearBy(LATITUDE, LONGITUDE,  callback,  options);

```
