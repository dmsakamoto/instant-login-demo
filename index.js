/**
 * index.js - Registers ES2015 on the server-side to ensure we can use ES2015
 */

'use strict'

require('babel-register');

module.export=require('./server')
