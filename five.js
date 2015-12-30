var five = require("johnny-five"),
    Edison = require("edison-io"),
    board = new five.Board({
        io: new Edison()
    }),
    express = require("express"),
    app = express(),
    server = app.listen(3000);

app.use(express.static('public'));

board.on("ready", function() {
  var rightServo = new five.Servo.Continuous(5),
      leftServo = new five.Servo.Continuous(6),
      led = new five.Led(13),
      piezo = new five.Piezo(3),
      la_cucaracha = '- - C C - C C - C C - F F F F - A A A A - -',
      photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
      });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    if(this.value > 750) {
        led.on();
    } else {
        led.off();
    }
  });


  // Add to REPL
  this.repl.inject({
    led: led,
    rightServo: rightServo,
    leftServo: leftServo,
    piezo: piezo,
    pot: photoresistor
  });

  app.post('/forward', function(sReq, sRes){
    rightServo.cw(1);
    leftServo.ccw(1);
    
    sRes.end();
  });
  
  app.post('/backward', function(sReq, sRes){
    rightServo.ccw(1);
    leftServo.cw(1);
    
    sRes.end();
  });

  app.post('/right', function(sReq, sRes){
    rightServo.ccw(0.5);
    leftServo.ccw(0.5);
    
    sRes.end();
  });

  app.post('/left', function(sReq, sRes){
    rightServo.cw(0.5);
    leftServo.cw(0.5);
    
    sRes.end();
  });
  
  app.post('/stop', function(sReq, sRes){
    rightServo.cw(0);
    leftServo.cw(0);
    
    sRes.end();
  });
  
  app.post('/honk', function(sReq, sRes){
    piezo.play({
        // song is composed by a string of notes
        // a default beat is set, and the default octave is used
        // any invalid note is read as "no note"
        song: la_cucaracha + la_cucaracha,
        beats: 1 / 8,
        tempo: 100
    });
    
    sRes.end();
  });
});