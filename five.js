var five = require("johnny-five"),
    Edison = require("edison-io"),
    express = require("express"),
    fs = require("fs"),
    app = express(),
    server = app.listen(3000);

app.use(express.static('public'));

var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var rightServo = new five.Servo.Continuous(13),
      leftServo = new five.Servo.Continuous(12);

  //led.on();

  // Add to REPL
  this.repl.inject({
    //led: led,
    rightServo: rightServo,
    leftServo: leftServo
  });

  app.post('/forward', function(sReq, sRes){
    rightServo.cw(1);
    leftServo.ccw(1);
  });
  
  app.post('/backward', function(sReq, sRes){
    rightServo.ccw(1);
    leftServo.cw(1);
  });

  app.post('/right', function(sReq, sRes){
    rightServo.ccw(1);
    leftServo.ccw(1);
  });

  app.post('/left', function(sReq, sRes){
    rightServo.cw(1);
    leftServo.cw(1);
  });
  
  app.post('/stop', function(sReq, sRes){
    rightServo.stop();
    leftServo.stop();
  });
});
