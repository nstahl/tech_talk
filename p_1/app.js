
/**
 * Module dependencies.
 */

var twitter = require('ntwitter');


/**
 * Twitter Stream
 */
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

    var text = data.text.toLowerCase();
    if((data.geo !== null)){ //&& (regex.exec(data.text) !== null)) {

      var newTweetObj = { 
        text: data.text,
        lat: data.geo.coordinates[0],
        lon: data.geo.coordinates[1],
        time: data.created_at
      };

      console.log(newTweetObj);
    }
  });
});

