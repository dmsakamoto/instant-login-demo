

'use strict'

// Load dependencies
let express = require('express');
let session = require('express-session');
let morgan = require('morgan');
let bodyParser = require('bodyParser');
let path = require('path');
// Local dependencies
// let api = require('./api');
let oauth = require('./oauth');
let config = require('./config');

// Set up server and global middleware
let app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  'secret': 'somesecret',
  'resave': false,
  'saveUnitialized': true,
  'cookie': { 'secure': true }
}));

// This is the route to the OAuth Middleware
app.use('/oauth', oauth);

// This sets up hotloading
if (config.hotloading) {
  let webpack = require('webpack');
  let webpackDevMiddleware = require('webpack-dev-middleware');
  let webpackHotMiddleware = require('webpack-hot-middleware');
  let webpackConfig = require('../webpack.config');
  let compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// app.use('/api', api);

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/../public' });
});

app.listen(config.port);
console.log('Listening on http://localhost:' + config.port);
