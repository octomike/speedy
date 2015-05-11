var Geolib = require('geolib');
var Layout = require('layout');

var layout = new Layout();
layout.show();

var id;
var oldpos;
var timings = {
  samples: [],  /* holds every received dataport in the last minute */
  highspeed: 0,
  distance: 0,
};
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 1000, 
  timeout: 5000
};

function sum(a,b){
  return a+b;
}

function updateAverages(speed){
  /* FIXME: remove samplerate=1/s assumption */
  
  var avg1,avg5,avg15;
  var sum5,sum15;
  
  timings.samples.push(speed);
  avg1 = timings.samples.slice(0,60).reduce(sum,0)/timings.samples.length;
  avg5 = avg15 = avg1;
  
  if (timings.samples.length >= 60){
    avg1 = timings.samples.slice(-60).reduce(sum,0)/60;
    sum5 = timings.samples.slice(-60*5).reduce(sum,0);
    avg5 = sum5/timings.samples.length;
    avg15 = avg5;
  }
  if (timings.samples.length >= 60*5) {
    avg5 = sum5/(60*5);
    sum15 = timings.samples.slice(-60*15).reduce(sum,0);
    avg15 = sum15/timings.samples.length;
  }
  if (timings.samples.length >= 60*15) {
    avg15 = sum15/(60*15);
    /* discard old sample only when buffer is "full" (15min + x) */
    timings.samples.shift(); 
  }
  
  /* update layout */
  layout.setAvg(avg1, avg5, avg15);
}

function locationSuccess(pos) {
  oldpos = {
    coords: {
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude + Math.random()/20000 + 1/12000,
    },
    timestamp: pos.timestamp - 750 - 500*Math.random()
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
  
  updateAverages(speed);
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