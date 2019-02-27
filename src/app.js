var Credentials = require('./credentials');
var Twitter = require('twitter');

var client = new Twitter({
  'consumer_key': Credentials.TWITTER_consumer_key,
  'consumer_secret': Credentials.TWITTER_consumer_secret,
  'access_token_key': Credentials.TWITTER_access_token_key,
  'access_token_secret': Credentials.TWITTER_access_token_secret
});

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var stream = null;
var tweet = null;

server.listen(3080);

io.on('connection', function onConnection (socket) {
  socket.on('search', function onSearch (keyword) {
    console.log(keyword);
    if (stream) {
      stream.destroy();
    }

    stream = client.stream('statuses/filter', {'track': keyword});
    stream.on('data', function onData (event) {
      tweet = {
        'created_at': event.created_at,
        'id_str': event.id_str,
        'text': event.text,
        'user': {
          'name': event.user.name,
          'screen_name': event.user.screen_name,
          'profile_image_url': event.user.profile_image_url
        },
        'reply_count': event.reply_count,
        'retweet_count': event.retweet_count,
        'favorite_count': event.favorite_count,
        'geo': event.geo
      };
      socket.emit('tweet', tweet);
    });
    stream.on('error', function onError (error) {
      console.log(error);
    });
  });
});
