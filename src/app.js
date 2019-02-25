var Credentials = require('./credentials');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: Credentials.TWITTER_consumer_key,
  consumer_secret: Credentials.TWITTER_consumer_secret,
  access_token_key: Credentials.TWITTER_access_token_key,
  access_token_secret: Credentials.TWITTER_access_token_secret
});

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var stream = null;

server.listen(80);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('search', function (keyword) {
    console.log(keyword);
    stream = client.stream('statuses/filter', {track: keyword});
    stream.on('data', function(event) {
      socket.emit('tweet', event);
    });
  });
});
