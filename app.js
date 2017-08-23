'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//routing

var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//headers

// routes base

app.use('/api', user_routes);

module.exports = app;