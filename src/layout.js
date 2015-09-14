var UI = require('ui');
var Vector2 = require('vector2');

var Layout = function(opt){

    this.wind = new UI.Window();
    this.debug = opt.debug;

    this.debugBorderColor = function(){
      if( this.debug ){
        return 'white'
      } else {
        return 'black'
      }
    };

    this.initNumber = function(){
      if( this.debug ){
        var num = 20 + Math.random()*30;
        return num.toFixed(1);
      } else {
        return '--.-'
      }
    };

    /* 144x152 */
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

    this.speedTextVal = new UI.Text({
      text: this.initNumber(),
      color: 'white',
      font: 'bitham-42-bold',
      position: new Vector2(19,34),
      size: new Vector2(104,44),
      backgroundColor: 'black',
      textAlign: 'right',
      borderColor: this.debugBorderColor(),
    });

    this.speedTextUnit = new UI.Text({
      text: 'km/h',
      color: 'white',
      font: 'gothic-14',
      position: new Vector2(58,18),
      size: new Vector2(28,16),
      backgroundColor: 'black',
      borderColor: this.debugBorderColor(),
    });

    this.avgTextVal = new UI.Text({
      text: this.initNumber()+'\n'+this.initNumber()+'\n'+this.initNumber(),
      color: 'white',
      font: 'gothic-24-bold',
      position: new Vector2(30,78),
      size: new Vector2(40,74),
      backgroundColor: 'black',
      textAlign: 'right',
      borderColor: this.debugBorderColor(),
    });

    this.highspeedTextVal = new UI.Text({
      text: this.initNumber(),
      color: 'white',
      font: 'gothic-28',
      position: new Vector2(70,78),
      size: new Vector2(50,30),
      backgroundColor: 'black',
      textAlign: 'right',
      borderColor: this.debugBorderColor(),
    });

    this.highspeedTextUnit = new UI.Text({
      text: 'km/h',
      color: 'white',
      font: 'gothic-09',
      position: new Vector2(120,96),
      size: new Vector2(22,12),
      textAlign: 'right',
      backgroundColor: 'black',
      borderColor: this.debugBorderColor(),
    });

    this.distanceTextVal = new UI.Text({
      text: this.initNumber(),
      color: 'white',
      font: 'gothic-28',
      position: new Vector2(70,108),
      size: new Vector2(50,30),
      backgroundColor: 'black',
      textAlign: 'right',
      borderColor: this.debugBorderColor(),
    });

    this.distanceTextUnit = new UI.Text({
      text: 'km',
      color: 'white',
      font: 'gothic-09',
      position: new Vector2(120,126),
      size: new Vector2(22,12),
      textAlign: 'right',
      backgroundColor: 'black',
      borderColor: this.debugBorderColor(),
    });

    this.debugText = new UI.Text({
      text: 'debug layer',
      color: 'black',
      font: 'gothic-09',
      position: new Vector2(70,139),
      size: new Vector2(73,12),
      backgroundColor: 'yellow',
      textAlign: 'left',
    });


    this.wind.add(this.circleOuter);
    this.wind.add(this.circleInner);
    this.wind.add(this.circleOverlay);
    this.wind.add(this.circleOverlay2);
    this.wind.add(this.avgTextVal);
    this.wind.add(this.speedTextVal);
    this.wind.add(this.speedTextUnit);
    this.wind.add(this.distanceTextUnit);
    this.wind.add(this.distanceTextVal);
    this.wind.add(this.highspeedTextUnit);
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

  setDebug: function(val) {
    this.debugText.text(val);
  },

  setUnavailable: function(msg) {
    this.speedTextVal.text('--.-');
    this.speedTextUnit.text(msg);
  },

  setSpeed: function(val) {
    this.speedTextVal.text(val.toFixed(1));
    this.speedTextUnit.text('km/h');
  },

  setDistance: function(val) {
    this.distanceTextVal.text((val/1000).toFixed(1));
  },

  setHighspeed: function(val) {
    this.highspeedTextVal.text(val.toFixed(1));
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
      menu.hide();
    });
    this.wind.on('click','select',function (e){
      console.log('select button clicked');
      menu.show();
    });
  },

  setBackButton: function(handler){
    var menu = this.menu;
    var wind = this.wind;
    this.wind.on('click','back',function (e){
      console.log('back button clicked');
      wind.show();
      menu.hide();
      handler();
    });
  },
  show: function() {
    this.wind.show();
  },
};

if (typeof module !== 'undefined') {
  module.exports = Layout;
}

