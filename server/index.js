/**
 * index.js - Main server file that we will use for our demo app
 */

'use strict'

// Load dependencies
let express = require('express');

// Set up server
let app = express();

// Set configuration variables
let config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
}

// Load middleware
app.use('/images', express.static(__dirname + '/../public/images'));

// Set up initial routes and requests
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/../public' });
});

app.get('/app', function (req, res) {
  res.sendFile('app.html', { root: __dirname + '/../public' });
})

app.listen(config.port);
console.log('Listening on http://localhost:' + config.port);
