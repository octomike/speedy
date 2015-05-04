var UI = require('ui');
var Vector2 = require('vector2');

var Layout = function(){
  
    console.log("constructing layout");
  
    this.wind = new UI.Window();
    
    /* 168x144 */
    this.circleOuter = new UI.Circle({
      position: new Vector2(72,70),
      radius: 66,
      backgroundColor: 'white'
    });

    this.circleInner = new UI.Circle({
      position: new Vector2(72,70),
      radius: 64,
      backgroundColor: 'black'
    });

    this.circleOverlay = new UI.Rect({
      position: new Vector2(28,80),
      size: new Vector2(116,72),
      backgroundColor: 'black'
    });
  
    this.circleOverlay2 = new UI.Rect({
      position: new Vector2(0,120),
      size: new Vector2(144,48),
      backgroundColor: 'black'
    });

    this.circleOverlay3 = new UI.Rect({
      position: new Vector2(27,79),
      size: new Vector2(116,72),
      backgroundColor: 'white'
    });
  
    this.AvgText = new UI.Text({
      text: 'Avg: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,84),
      size: new Vector2(110,16),
      backgroundColor: 'black',
    });

    this.DistanceText = new UI.Text({
      text: 'Distance: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,100),
      size: new Vector2(110,16),
      backgroundColor: 'black',
    });
  
    this.MaxText = new UI.Text({
      text: 'Maximum Speed: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,116),
      size: new Vector2(110,16),
      backgroundColor: 'black',
    });
    
    this.speedText = new UI.Text({
      text: '23.5',
      color: 'white',
      font: 'bitham-42-light',
      position: new Vector2(20,32),
      size: new Vector2(102,44),
      backgroundColor: 'black',
      textAlignment: 'right'
    });
  
    this.speedTextUnit = new UI.Text({
      text: 'km/h',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(104,60),
      size: new Vector2(28,20),
      backgroundColor: 'black',
    });

    this.wind.add(this.circleOuter);
    this.wind.add(this.circleInner);
    //this.wind.add(this.circleOverlay3);
    this.wind.add(this.circleOverlay);
    this.wind.add(this.circleOverlay2);
    this.wind.add(this.AvgText);
    this.wind.add(this.DistanceText);
    this.wind.add(this.MaxText);
    this.wind.add(this.speedText);
    this.wind.add(this.speedTextUnit);
  
};

Layout.prototype = {
  constructor: Layout,
  
  setSpeed: function(e) {
    this.speedText.text(e);
  },
  
  setLongitude: function(e) {
    this.longitudeText.text('Lat: ' + e);
  },
  
  setLatitude: function(e) {
    this.latitudeText.text('Long: ' + e);
  },
  
  show: function(e) {
    this.wind.show();
  },
};

if (typeof module !== 'undefined') {
  module.exports = Layout;
}

