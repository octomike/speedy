var Geolib = require('geolib');
var Layout = require('layout');

var layout = new Layout();
layout.show();

var id;
var oldpos;
var timings = {
  avg1: [],
  avg2: [],
  avg3: [],
  highspeed: 0,
  distance: 0,
};
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 1000, 
  timeout: 5000
};


function locationSuccess(pos) {
  oldpos = {
    coords: {
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude + Math.random()/20000 + 1/12000,
    },
    timestamp: pos.timestamp - 1000
  };
  var oldcoord = {
    latitude: oldpos.coords.latitude,
    longitude: oldpos.coords.longitude,
    time: oldpos.timestamp
  };
  var newcoord = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    time: pos.timestamp
  };
  timings.distance += Geolib.getDistance(oldcoord,newcoord);
  layout.setDistance(timings.distance);
  
  var speed = Geolib.getSpeed(oldcoord,newcoord, { unit: 'kmh' });
  layout.setSpeed(speed);
  
  timings.highspeed = speed > timings.highspeed ? speed : timings.highspeed;
  layout.setHighspeed(timings.highspeed);
  
  /* TODO: calculate averages */
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

/* to be removed once I have a real pebble! */
function locationSuccessSimulate() {
  locationSuccess(oldpos);
}

function resetAverages(){
}

function resetDistance(){
  timings.distance=0;
}

function resetHighspeed(){
  timings.highspeed=0;
}

/* register event handlers */
setInterval(locationSuccessSimulate, 1000);

Pebble.addEventListener('ready',
  function(e) {
    // Get location updates
    id = navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
  }
);


var menuSections = [{
  title: 'Speedy Actions',
  items: [{
    title: 'Reset Averages',
    subtitle: ''
  },
  {
    title: 'Reset Highspeed',
    subtitle: ''
  },
  {
    title: 'Reset Distance',
    subtitle: ''
  }]
}];

var menuFunctions = [
  resetAverages,
  resetHighspeed,
  resetDistance,
];

layout.setMenu(menuSections, menuFunctions);