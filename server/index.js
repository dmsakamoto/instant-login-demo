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

// Load Clever ID and Secret for respective environment
if (config.env === 'development') {
  let secrets = require('./secrets');
  config.clever.id = secrets.clever.id;
  config.clever.secret = secrets.clever.secret;
} else {
  config.clever.id = process.env.CLEVER_ID;
  config.clever.secret = process.env.CLEVER_SECRET;
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
