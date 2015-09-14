var Geolib = require('geolib');
var Layout = require('layout');

/* namespace */
var Speedy = {};

Speedy.layout = new Layout({debug: false});

/* data storage */
var storedTimings = JSON.parse(localStorage.getItem('speedytimings'));
//console.log(JSON.stringify(storedTimings));
if(storedTimings === undefined || storedTimings === {}) {
    /* first start ever */
    Speedy.timings = {
      samples: [],  /* holds every received dataport in the last minute */
      highspeed: 0,
      distance: 0,
    };
} else {
    /* load last values via localStorage */
    Speedy.timings = storedTimings;
    //console.log(JSON.stringify({storage: Speedy.timings}));
    Speedy.layout.setHighspeed(Speedy.timings.highspeed);
    Speedy.layout.setDistance(Speedy.timings.distance);
}

/* watchposition */
Speedy.locationOptions = {
  enableHighAccuracy: true,
  maximumAge: 2000,
  timeout: 5000
};

/* other */

Speedy.lagginess = 0;

/* menu config */
Speedy.menuSections = [{
  title: 'Speedy Actions',
  items: [{
    title: 'Reset All',
    subtitle: ''
  },
  {
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
  Speedy.resetAll,
  Speedy.resetAverages,
  Speedy.resetHighspeed,
  Speedy.resetDistance,
];



/* helpers */
Speedy.sum = function(a,b){
  return a+b;
};

Speedy.clonepos = function(pos){
  Speedy.oldpos = {
    coords: {
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude,
      altitude: pos.coords.altitude,
      accuracy : pos.coords.accuracy,
    },
    timestamp: pos.timestamp
  };
};

Speedy.updateAverages = function(distance, timedelta){
  /* FIXME: somewhat inefficient, figure out how to do a continuous update */

  var avg1,avg5,avg15;
  var num1,num5,num15;
  var time1,time5,time15;

  num1=num5=num15=0;
  time1=time5=time15=0;
  Speedy.timings.samples.push({ distance: distance, timedelta: timedelta });
  for( var i=Speedy.timings.samples.length-1 ; i >=0 ; i-- ){
    if(time1 <= 60000 ){
      time1 += Speedy.timings.samples[i].timedelta;
      num1++;
    }
    if(time5 <= 5*60000 ){
      time5 += Speedy.timings.samples[i].timedelta;
      num5++;
    }
    if(time15 <= 15*60000 ){
      time15 += Speedy.timings.samples[i].timedelta;
      num15++;
    }
  }
  //console.log(JSON.stringify(Speedy.timings.samples));

  avg1 = Speedy.timings.samples.slice(-num1).reduce(function(a,b){
          return (a + b.distance);
         },0)*1000/time1;
  avg5 = Speedy.timings.samples.slice(-num5).reduce(function(a,b){
          return (a + b.distance);
         },0)*1000/time5;
  avg15 = Speedy.timings.samples.slice(-num15).reduce(function(a,b){
            return (a + b.distance);
          },0)*1000/time15;

  if (time15 > 15*60000) {
    /* discard old sample only when buffer is "full" (15min + x) */
    Speedy.timings.samples.shift();
  }
  //console.log(JSON.stringify({num1: num1, num5: num5, num15: num15}));
  //console.log(JSON.stringify({time1: time1, time5: time5, time15: time15}));
  //console.log(JSON.stringify({avg1: avg1, avg5: avg5, avg15: avg15}));

  /* update layout */
  Speedy.layout.setAvg(3.6*avg1, 3.6*avg5, 3.6*avg15);
};

Speedy.locationSuccessSimulate = function(){
  var pos = {
    coords: {
      latitude : 52 + Math.random()/10000,
      longitude : 30 + Math.random()/10000,
      altitude: 0,
      accuracy : 1,
      speed: null,
    },
    timestamp: Date.now()
  };
  Speedy.locationSuccess(pos);
};

Speedy.locationSuccess = function(pos){
  if( typeof(Speedy.oldpos) ==  'undefined' ){
    Speedy.clonepos(pos);
    Speedy.layout.setSpeed(0);
  }
  var oldcoord = {
    latitude: Speedy.oldpos.coords.latitude,
    longitude: Speedy.oldpos.coords.longitude,
    altitude: Speedy.oldpos.coords.altitude,
    time: Speedy.oldpos.timestamp
  };
  var newcoord = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    altitude: pos.coords.altitude,
    time: pos.timestamp
  };
  if (newcoord.time - oldcoord.time < 0)
    return; // TODO drop out of order updates for now
  var d = Geolib.getDistance(oldcoord,newcoord);
  //d = d - Speedy.oldpos.coords.accuracy - pos.coords.accuracy;
  //d = d - pos.coords.accuracy;
  //Speedy.timings.distance += d > 0 ? d : 0;
  d = d > 0 ? d : 0;
  //console.log(JSON.stringify({distance: d}));
  Speedy.timings.distance += d;

  var speed = pos.coords.speed;
  if( d === 0 )
    if( Speedy.lagginess == 3){
        Speedy.lagginess = 0;
    } else {
        Speedy.lagginess++;
        return;
    }
  else {
    if(speed === null || speed == {} || speed == 'undefined')
        speed = d*1000/(newcoord.time - oldcoord.time);
  }
  Speedy.layout.setSpeed(3.6*speed);
  Speedy.layout.setDistance(Speedy.timings.distance);
  Speedy.timings.highspeed = speed > Speedy.timings.highspeed ? speed : Speedy.timings.highspeed;
  Speedy.layout.setHighspeed(3.6*Speedy.timings.highspeed);
  Speedy.updateAverages(d, newcoord.time - oldcoord.time);
  Speedy.clonepos(pos);
};


Speedy.locationError = function(err){
    console.log('location error (' + err.code + '): ' + err.message);
    Speedy.layout.setUnavailable('no GPS');
};

Speedy.resetAll = function(){
  Speedy.resetAverages();
  Speedy.resetDistance();
  Speedy.resetHighspeed();
};

Speedy.resetAverages = function(){
  Speedy.timings.samples=[];
};

Speedy.resetDistance = function(){
  Speedy.timings.distance=0;
};

Speedy.resetHighspeed = function(){
  Speedy.timings.highspeed=0;
};

Speedy.exitHandler = function(){
  console.log('storing: ' + JSON.stringify(Speedy.timings));
  localStorage.setItem('speedytimings', JSON.stringify(Speedy.timings));
};

/* register event handlers */
setInterval(Speedy.locationSuccessSimulate, 1000);

Pebble.addEventListener('ready',
  function(e) {
  }
);

Speedy.layout.show();
Speedy.layout.setMenu(Speedy.menuSections, Speedy.menuFunctions);
Speedy.layout.setBackButton(Speedy.exitHandler);
console.log('registering geolocation handlers');
// Get location updates
Speedy.id = navigator.geolocation.watchPosition(Speedy.locationSuccess, Speedy.locationError, Speedy.locationOptions);
console.log('done');
