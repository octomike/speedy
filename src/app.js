var Geolib = require('geolib');
var Layout = require('layout');

/* namespace */
var Speedy = {};

Speedy.layout = new Layout(true);

/* data storage */
Speedy.timings = {
  samples: [],  /* holds every received dataport in the last minute */
  highspeed: 0,
  distance: 0,
};

/* watchposition */
Speedy.locationOptions = {
  enableHighAccuracy: true,
  maximumAge: 1000,
  timeout: 5000
};

/* menu config */
Speedy.menuSections = [{
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

Speedy.menuFunctions = [
  resetAverages,
  resetHighspeed,
  resetDistance,
];


/* helpers */
function sum(a,b){
  return a+b;
}

function clonepos(pos){
  Speedy.oldpos = {
    coords: {
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude,
    },
    timestamp: pos.timestamp
  };
}

function updateAverages(speed){
  /* FIXME: remove samplerate=1/s assumption */

  var avg1,avg5,avg15;
  var sum5,sum15;

  Speedy.timings.samples.push(speed);
  avg1 = Speedy.timings.samples.slice(0,60).reduce(sum,0)/Speedy.timings.samples.length;
  avg5 = avg15 = avg1;

  if (Speedy.timings.samples.length >= 60){
    avg1 = Speedy.timings.samples.slice(-60).reduce(sum,0)/60;
    sum5 = Speedy.timings.samples.slice(-60*5).reduce(sum,0);
    avg5 = sum5/Speedy.timings.samples.length;
    avg15 = avg5;
  }
  if (Speedy.timings.samples.length >= 60*5) {
    avg5 = sum5/(60*5);
    sum15 = Speedy.timings.samples.slice(-60*15).reduce(sum,0);
    avg15 = sum15/Speedy.timings.samples.length;
  }
  if (Speedy.timings.samples.length >= 60*15) {
    avg15 = sum15/(60*15);
    /* discard old sample only when buffer is "full" (15min + x) */
    Speedy.timings.samples.shift();
  }

  /* update layout */
  layout.setAvg(avg1, avg5, avg15);
}

function locationSuccess(pos) {
  if( oldpos == 'undefined' ){
    clonepos(pos);
  }
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
  Speedy.timings.distance += Geolib.getDistance(oldcoord,newcoord);
  layout.setDistance(Speedy.timings.distance);

  var speed;
  if( Speedy.timings.distance === 0 )
    speed = 0;
  else
    speed = Geolib.getSpeed(oldcoord,newcoord, { unit: 'kmh' });
  layout.setSpeed(speed);

  Speedy.timings.highspeed = speed > Speedy.timings.highspeed ? speed : Speedy.timings.highspeed;
  layout.setHighspeed(Speedy.timings.highspeed);

  updateAverages(speed);

  console.log(JSON.stringify(pos));
  clonepos(pos);
}


function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

function resetAverages(){
  Speedy.timings.samples=[];
}

function resetDistance(){
  Speedy.timings.distance=0;
}

function resetHighspeed(){
  Speedy.timings.highspeed=0;
}


/* register event handlers */
//setInterval(locationSuccessSimulate, 1000);

Pebble.addEventListener('ready',
  function(e) {
    layout.show();
    layout.setMenu(Speedy.menuSections, Speedy.menuFunctions);
    console.log('registering geolocation handlers');
    // Get location updates
    Speedy.id = navigator.geolocation.watchPosition(locationSuccess, locationError, Speedy.locationOptions);
  }
);
