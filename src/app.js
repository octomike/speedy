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
  Speedy.resetAverages,
  Speedy.resetHighspeed,
  Speedy.resetDistance,
];


/* helpers */
Speedy.sum = function(a,b){
  return a+b;
}

Speedy.clonepos = function(pos){
  Speedy.oldpos = {
    coords: {
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude,
    },
    timestamp: pos.timestamp
  };
}

Speedy.updateAverages = function(speed){
  /* FIXME: remove samplerate=1/s assumption */

  var avg1,avg5,avg15;
  var sum5,sum15;

  Speedy.timings.samples.push(speed);
  avg1 = Speedy.timings.samples.slice(0,60).reduce(Speedy.sum,0)/Speedy.timings.samples.length;
  avg5 = avg15 = avg1;

  if (Speedy.timings.samples.length >= 60){
    avg1 = Speedy.timings.samples.slice(-60).reduce(Speedy.sum,0)/60;
    sum5 = Speedy.timings.samples.slice(-60*5).reduce(Speedy.sum,0);
    avg5 = sum5/Speedy.timings.samples.length;
    avg15 = avg5;
  }
  if (Speedy.timings.samples.length >= 60*5) {
    avg5 = sum5/(60*5);
    sum15 = Speedy.timings.samples.slice(-60*15).reduce(Speedy.sum,0);
    avg15 = sum15/Speedy.timings.samples.length;
  }
  if (Speedy.timings.samples.length >= 60*15) {
    avg15 = sum15/(60*15);
    /* discard old sample only when buffer is "full" (15min + x) */
    Speedy.timings.samples.shift();
  }

  /* update layout */
  Speedy.layout.setAvg(avg1, avg5, avg15);
}

Speedy.locationSuccess = function(pos){
  if( Speedy.oldpos == 'undefined' ){
    Speedy.clonepos(pos);
  }
  var oldcoord = {
    latitude: Speedy.oldpos.coords.latitude,
    longitude: Speedy.oldpos.coords.longitude,
    time: Speedy.oldpos.timestamp
  };
  var newcoord = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    time: pos.timestamp
  };
  Speedy.timings.distance += Geolib.getDistance(oldcoord,newcoord);
  Speedy.layout.setDistance(Speedy.timings.distance);

  var speed;
  if( Speedy.timings.distance === 0 )
    speed = 0;
  else
    speed = Geolib.getSpeed(oldcoord,newcoord, { unit: 'kmh' });
  Speedy.layout.setSpeed(speed);

  Speedy.timings.highspeed = speed > Speedy.timings.highspeed ? speed : Speedy.timings.highspeed;
  Speedy.layout.setHighspeed(Speedy.timings.highspeed);

  Speedy.updateAverages(speed);

  console.log(JSON.stringify(pos));
  Speedy.clonepos(pos);
}


Speedy.locationError = function(err){
  console.log('location error (' + err.code + '): ' + err.message);
}

Speedy.resetAverages = function(){
  Speedy.timings.samples=[];
}

Speedy.resetDistance = function(){
  Speedy.timings.distance=0;
}

Speedy.resetHighspeed = function(){
  Speedy.timings.highspeed=0;
}


/* register event handlers */
//setInterval(locationSuccessSimulate, 1000);

Pebble.addEventListener('ready',
  function(e) {
    Speedy.layout.show();
    Speedy.layout.setMenu(Speedy.menuSections, Speedy.menuFunctions);
    console.log('registering geolocation handlers');
    // Get location updates
    Speedy.id = navigator.geolocation.watchPosition(Speedy.locationSuccess, Speedy.locationError, Speedy.locationOptions);
  }
);
