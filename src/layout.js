var UI = require('ui');
var Vector2 = require('vector2');

var Layout = function(debug){

    this.wind = new UI.Window();
    this.debug = debug;

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
      position: new Vector2(18,34),
      size: new Vector2(88,44),
      backgroundColor: 'black',
      textAlign: 'right',
    });

    this.speedTextUnit = new UI.Text({
      text: 'km/h',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(107,62),
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

    this.highspeedText = new UI.Text({
      text: 'Max: ',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(34,100),
      size: new Vector2(30,16),
      textAlign: 'left',
      backgroundColor: 'black',
    });

    this.highspeedTextVal = new UI.Text({
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
    this.debugText = new UI.Text({
      text: 'debug layer',
      color: 'black',
      font: 'gothic-14-bold',
      position: new Vector2(0,152),
      size: new Vector2(144,16),
      backgroundColor: 'yellow',
      textAlign: 'left',
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
    this.wind.add(this.highspeedText);
    this.wind.add(this.highspeedTextVal);
    if( this.debug )
      this.wind.add(this.debugText);

    this.menu = new UI.Menu({
      sections: []
    });

};

Layout.prototype = {
  constructor: Layout,

  debug: false,

  setSpeed: function(val) {
    this.speedText.text(val.toFixed(1));
  },

  setDistance: function(val) {
    this.distanceTextVal.text((val/1000).toFixed(1) + ' km');
  },

  setHighspeed: function(val) {
    this.highspeedTextVal.text(val.toFixed(1) + 'km/h');
  },

  setAvg: function(val1, val5, val15){
    this.avgTextVal.text(val1.toFixed(1) + ' ' + val5.toFixed(1) + ' ' + val15.toFixed(1));
  },

  setMenu: function(sections,handlers) {
    for(var i=0; i< sections.length; i++){
      this.menu.section(i,sections[i]);
    }
    var menu = this.menu;
    var wind = this.wind;
    this.menu.on('select',function(e){
      handlers[e.itemIndex]();
      wind.show();
      this.hide();
    });
    this.wind.on('click','select',function (e){
      console.log('select button clicked');
      menu.show();
      this.hide();
    });
    this.wind.on('click','back',function (e){
      console.log('back button clicked');
      menu.hide();
      this.show();
    });
  },

  show: function() {
    this.wind.show();
  },
};

if (typeof module !== 'undefined') {
  module.exports = Layout;
}

