//var Geolib = require('geolib');
var Layout = require('layout');

//var wind = new UI.Window();
var layout = new Layout();
layout.show();

var id;
var oldpos;
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 1000, 
  timeout: 5000
};

function locationSuccess(pos) {
  //Layout.setLatitude(pos.coords.latitude);
  //Layout.setLongitude(pos.coords.longitude);
  console.log(JSON.stringify(pos));
  //speedText.text((3.6 * parseFloat(pos.coords.speed)));
  Layout.setSpeed('31.4');
  oldpos = pos;
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('ready',
  function(e) {
    // Get location updates
    id = navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
  }
);