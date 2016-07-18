/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as morgan from 'morgan';

import * as staticRoutes from './routes/static';
// import restfulRoutes = require('./routes/restful');

// import staticRoutes = require('./routes/static');


// Local config file.
var config = require('../config.js');

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);

app.use(bodyParser.json());

// Passport requirements
app.use(passport.initialize());
app.use(passport.session());

// Pretty logs
app.use(morgan('dev'));

// All other routes are static
app.use(express.static('public'));

// Listen on desired port
server.listen(config.port);

// Express static routesv
app.route('/').get(staticRoutes.index);



console.log("Server started on port:" + config.port);
