var Credentials = require('./credentials');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: Credentials.TWITTER_consumer_key,
  consumer_secret: Credentials.TWITTER_consumer_secret,
  access_token_key: Credentials.TWITTER_access_token_key,
  access_token_secret: Credentials.TWITTER_access_token_secret
});

var stream = client.stream('statuses/filter', {track: 'javascript'});
stream.on('data', function(event) {
  console.log(event);
});

stream.on('error', function(error) {
  throw error;
});
