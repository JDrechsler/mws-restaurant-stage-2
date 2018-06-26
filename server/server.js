var restaurants = require('./data/restaurants.json');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8080;

server.listen(port, function() {
  console.log(`Listening on Port: ${port}, localhost:${port}`);
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  res.setHeader('Access-Control-Allow-Credentials', true);
  next();

  // headers from here: https://franciskim.co/how-to-data-collection-automation-bot-using-node-js-your-browser/
});

app.use(express.static(__dirname));

app.get('/', function(request, response) {
  response.send('Server is up and running. Yay!');
});

app.get('/restaurants', function name(req, res) {
  res.send(restaurants);
});
