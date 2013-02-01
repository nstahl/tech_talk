
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , twitter = require('ntwitter')
  , path = require('path');


/**
 * Server.
 */
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res)
    {
      res.sendfile("index.html");
    });

app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
 * Twitter Stream
 */
var io = require('socket.io').listen(server);


//insert credentials here
var twit = new twitter({
  consumer_key: 'RLhJSDRYWcoG7F0Usyml3w',
  consumer_secret: 'n2cLKkJ7X8NXFSfwtv4jMprNnzMO939Mx2sTvVSsPk',
  access_token_key: '703310240-ybBD14AEtXfu45cvHQI3NkUJQ4mX7Z0muaD6ohWF',
  access_token_secret: 'jiLQjc6YPidhnCsVHfupP5318GbYuiXkEIFFeZ9n5FM'
});


//nyc bounding box
var locationJSON = {'locations':'-74.036,40.67,-73.9,40.84'};

//define stream
twit.stream('statuses/filter', locationJSON, function(stream) {
  stream.on('data', function (data) {

    //prep for regex
    var text = data.text.toLowerCase();
    //check that coordinate data is in fact included
    //var regex = /I\'m at|http|street|block|dark|light|loud|quiet|walk|park|city|neighborhood|building|creative/;

    if((data.geo !== null)){ //&& (regex.exec(data.text) !== null)) {

      var newTweetObj = { 
        //user: data.user.screen_name, 
        text: data.text,
        lat: data.geo.coordinates[0],
        lon: data.geo.coordinates[1],
        time: data.created_at
      };

      //console.log(newTweetObj);
      io.sockets.volatile.emit('tweet', newTweetObj);
    }
  });
});

