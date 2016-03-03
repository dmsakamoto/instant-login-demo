
'use strict';

let _ = require('lodash');

let config = {
  'dev': 'development',
  'test': 'testing',
  'prod': 'production',
  'port': process.env.PORT || 3000
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;

config.env = process.env.NODE_ENV;

let environment = {};

if (config.env === config.dev) {
  // Configure local development environment
  let secrets = require('../secrets.js');
  environment = {
    'hotloading': true,
    'cleverId': secrets.clever.id,
    'cleverSecret': secrets.clever.secret
  };
} else {
  // Configuration for production/testing environment
  environment = {
    'hotloading': false,
    'cleverId': process.env.CLEVER_ID,
    'cleverSecret': process.env.CLEVER_SECRET
  };
}

module.exports = _.merge(config, environment);
