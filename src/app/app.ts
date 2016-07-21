/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as morgan from 'morgan';

import * as staticRoutes from './routes/static';
import * as authRoutes from './routes/auth';

// Local config file.
var config = require('../config.js');

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
    }
}));

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
app.route('/keys/:email').get(authRoutes.getKeys);
app.route('/challenge').post(authRoutes.getChallenge);
app.route('/login').post(authRoutes.login);
app.route('/logout').get(authRoutes.logout);

console.log("Server started on port:" + config.port);
