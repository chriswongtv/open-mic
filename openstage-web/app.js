/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var bodyParser = require('body-parser');

var Firebase = require("firebase");

var RSVP = require('rsvp');

var GeoFire = require('geofire');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.post('/api/set', function(req, res) {
    var _event = req.body.event;
    var _lat = parseFloat(req.body.lat);
    var _lng = parseFloat(req.body.lng);

    var firebaseRef = new Firebase("https://openstage.firebaseio.com/location");
    var geoFire = new GeoFire(firebaseRef);

    geoFire.set(_event, [_lat, _lng]).then(function() {
	  res.send("Provided key has been added to GeoFire");
	}, function(error) {
	  res.send("Error: " + error);
	});
});