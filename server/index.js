/**
 * index.js - Main server file that we will use for our demo app
 */

'use strict'

const OAUTH_TOKEN_URL = 'https://clever.com/oauth/tokens';
const API_PREFIX = 'https://api.clever.com';

// Load dependencies
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let request = require('request');

// Set up server
let app = express();

/**
 * Server configuration
 */
let config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  clever: {}
}

// Load URL, Clever ID and Secret for respective environment
if (config.env === 'development') {
  config.url = 'http://localhost:3000'
  let secrets = require('./secrets');
  config.clever.id = secrets.id;
  config.clever.secret = secrets.secret;
} else {
  config.url = process.env.APP_URL;
  config.clever.id = process.env.CLEVER_ID;
  config.clever.secret = process.env.CLEVER_SECRET;
}

/**
 * Middleware
 */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  'secret': 'somesecret',
  'saveUninitialized': true,
  'resave': false,
  'cookie': { 'secure': true }
}));

// Middleware to serve static assets
app.use('/images', express.static(__dirname + '/../public/images'));

/**
 * App Routes
 */

// Helper function for making requests
let makeRequest = function (options, callback) {
  request(options, function(err, res, body) {
    if (!err) {
      let statusCode = res.statusCode;
      if (statusCode !== 200) {
        let error = body.error;
        console.error('Received non-200 status code:', statusCode, error);
        callback(error);
      } else {
        callback(null, body);
      }
    } else {
      console.error('Error with request:', err);
      callback(err);
    }
  });
};

// Homepage
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: __dirname + '/../public',
    redirect_uri: encodeURIComponent(config.url + '/oauth'),
    client_id: config.clever.id
  });
});

// OAuth 2.0 endpoint
app.get('/oauth', function (req, res) {
  if(!req.query.code){
    res.redirect('/');
  } else {
    // OAuth 2.0 Step 1 - Request Access Token
    let body = {
      code: req.body.code,
      grant_type: 'authorization_code',
      redirect_uri: config.url + '/oauth'
    };
    let options = {
      url: OAUTH_TOKEN_URL,
      method: 'POST',
      json: body,
      headers: {
        Authorization: 'Basic ' + new Buffer(config.id + ':' + config.secret).toString('base64')
      }
    }
    makeRequest(options, function(err, result) {
      if (!err) {
        // OAuth 2.0 Step 2 - Clever sends back Access Token
        let token = result.access_token;
        options = {
          url: API_PREFIX + '/me',
          json: true,
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
        // OAuth 2.0 Step 3 -
        makeRequest(options, function (err, result){
          if (!err) {
            // OAuth 2.0 Step 4 - Clever has authorized the user
            console.log('Congratulations! The user is authorized!');
            req.session.user = result.data;
            res.redirect('/app');
          } else {
            console.error('Error with Access Token:', err);
            res.status(500).send(err);
          }
        });
      } else {
        console.error('Error with Authorization Code sent to Clever:', err);
        res.status(500).send(err);
      }
    });
  }
});

// App
app.get('/app', function (req, res) {
  if(!req.session.user) {
    res.redirect('/');
  } else {
    res.sendFile('app.html', { root: __dirname + '/../public' });
  }
});

// Logout
app.get('/logout', function (req, res) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    delete req.session.user;
    res.redirect('/');
  }
});

app.listen(config.port);

console.log('Listening on', config.url);
