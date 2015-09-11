var Geolib = require('geolib');
var Layout = require('layout');

/* namespace */
var Speedy = {};

Speedy.layout = new Layout({debug: true});

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

/* other */

Speedy.lagginess = 0;

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
  //console.log(JSON.stringify(d));
  Speedy.timings.distance += d;
  Speedy.layout.setDistance(Speedy.timings.distance);

  var speed;
  if( d === 0 )
    if( Speedy.lagginess == 3){
        Speedy.laggginess = 0;
    } else {
        Speedy.laggginess++;
        return;
    }
  else {
    if(pos.coords.speed !== null)
      speed = pos.coords.speed;
    else{
      speed = d/(newcoord.time - oldcoord.time)/1000;
    }
  }
  Speedy.layout.setSpeed(3.6*speed);

  Speedy.timings.highspeed = speed > Speedy.timings.highspeed ? speed : Speedy.timings.highspeed;
  Speedy.layout.setHighspeed(3.6*Speedy.timings.highspeed);

  //console.log(JSON.stringify({speed: speed}));
  Speedy.updateAverages(d, newcoord.time - oldcoord.time);

  Speedy.clonepos(pos);
};


Speedy.locationError = function(err){
console.log('location error (' + err.code + '): ' + err.message);
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

Speedy.menuFunctions = [
  Speedy.resetAverages,
  Speedy.resetHighspeed,
  Speedy.resetDistance,
];

/* register event handlers */
//setInterval(locationSuccessSimulate, 1000);

Pebble.addEventListener('ready',
  function(e) {
  }
);

Speedy.layout.show();
Speedy.layout.setMenu(Speedy.menuSections, Speedy.menuFunctions);
console.log('registering geolocation handlers');
console.log(JSON.stringify(Speedy.resetAverages));
console.log(JSON.stringify(Speedy.menuFunctions));
// Get location updates
Speedy.id = navigator.geolocation.watchPosition(Speedy.locationSuccess, Speedy.locationError, Speedy.locationOptions);
