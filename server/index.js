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
  'resave': false
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
        console.error('Received non-200 status code:', statusCode, error, body);
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
  res.sendFile('index.html', { root: __dirname + '/../public' });
});

// OAuth 2.0 endpoint
app.get('/oauth', function (req, res) {
  console.log('Received response from Clever');
  if(!req.query.code){
    res.redirect('/');
  } else {
    console.log('Received an Authorization Code from Clever', req.query.code);
    // OAuth 2.0 Step 1 - Request Access Token
    let body = {
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: config.url + '/oauth'
    };
    let options = {
      url: OAUTH_TOKEN_URL,
      method: 'post',
      json: body,
      headers: {
        'Authorization': 'Basic ' + new Buffer(config.clever.id + ':' + config.clever.secret).toString('base64'),
        'Content-Type': 'application/json'
      }
    }
    makeRequest(options, function(err, result) {
      console.log('Made a request for an Access Token with the code', options.json.code);
      if (!err) {
        // OAuth 2.0 Step 2 - Clever sends back Access Token
        let token = result.access_token;
        options = {
          url: API_PREFIX + '/me',
          method: 'get',
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
            console.log('Retrieved user', result);
            req.session.user = result.data;
            console.log(req.session.user);
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
  console.log('Redirected to app', req.session);
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
    req.session.destroy();
    res.redirect('/');
  }
});

app.listen(config.port);

console.log('Listening on', config.url);
