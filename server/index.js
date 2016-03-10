/**
 * index.js - Main server file that we will use for our demo app
 */

'use strict'

// Load dependencies
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let morgan = require('morgan');

// Set up server
let app = express();

// Set configuration variables
let config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  clever: {}
}

// Load Clever ID and Secret for respective environment
if (config.env === 'development') {
  let secrets = require('./secrets');
  config.clever.id = secrets.id;
  config.clever.secret = secrets.secret;
} else {
  config.clever.id = process.env.CLEVER_ID;
  config.clever.secret = process.env.CLEVER_SECRET;
}

// Load middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to serve static assets
app.use('/images', express.static(__dirname + '/../public/images'));

// Set up initial routes and requests
// Send homepage
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/../public' });
});

// Send app
app.get('/app', function (req, res) {
  res.sendFile('app.html', { root: __dirname + '/../public' });
})

app.listen(config.port);
console.log('Listening on http://localhost:' + config.port);
