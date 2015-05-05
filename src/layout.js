var UI = require('ui');
var Vector2 = require('vector2');

var Layout = function(){
  
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
  
    this.speedText = new UI.Text({
      text: '23.5',
      color: 'white',
      font: 'bitham-42-light',
      position: new Vector2(20,32),
      size: new Vector2(82,44),
      backgroundColor: 'black',
      textAlign: 'right',
    });
  
    this.speedTextUnit = new UI.Text({
      text: 'km/h',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(104,60),
      size: new Vector2(28,16),
      backgroundColor: 'black',
    });
  
    this.avgText = new UI.Text({
      text: 'Avg: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,84),
      size: new Vector2(30,16),
      backgroundColor: 'black',
      textAlign: 'left',
    });
  
    this.avgTextVal = new UI.Text({
      text: '01.1 10.2 15.3',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(64,84),
      size: new Vector2(74,16),
      backgroundColor: 'black',
      textAlign: 'right',
    });

    this.maxText = new UI.Text({
      text: 'Max: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,100),
      size: new Vector2(30,16),
      textAlign: 'left',
      backgroundColor: 'black',
    });
  
    this.maxTextVal = new UI.Text({
      text: '0 km/h',
      color: 'white',
      font: 'gothic-14-bold',
      position: new Vector2(64,100),
      size: new Vector2(74,16),
      backgroundColor: 'black',
      textAlign: 'right',
    });
  
    this.distanceText = new UI.Text({
      text: 'Distance: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,116),
      size: new Vector2(56,16),
      backgroundColor: 'black',
      textAlign: 'left',
    });
  
    this.distanceTextVal = new UI.Text({
      text: '0',
      color: 'white',
      font: 'gothic-14-bold',
      position: new Vector2(90,116),
      size: new Vector2(48,16),
      backgroundColor: 'black',
      textAlign: 'right',
    });

    this.wind.add(this.circleOuter);
    this.wind.add(this.circleInner);
    this.wind.add(this.circleOverlay);
    this.wind.add(this.circleOverlay2);
    this.wind.add(this.speedText);
    this.wind.add(this.speedTextUnit);
    this.wind.add(this.avgText);
    this.wind.add(this.avgTextVal);
    this.wind.add(this.distanceText);
    this.wind.add(this.distanceTextVal);
    this.wind.add(this.maxText);
    this.wind.add(this.maxTextVal);
  
};

Layout.prototype = {
  constructor: Layout,
  
  setSpeed: function(e) {
    this.speedText.text(e.toFixed(1));
  },
  
  setDistance: function(e) {
    this.distanceTextVal.text((e/1000).toFixed(1) + ' km');
  },
  
  setMax: function(e) {
    this.maxTextVal.text(e + 'km/h');
  },
  
  show: function(e) {
    this.wind.show();
  },
};

if (typeof module !== 'undefined') {
  module.exports = Layout;
}

