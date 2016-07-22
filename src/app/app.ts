/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';

import * as staticRoutes from './routes/static';
import * as authRoutes from './routes/auth';
import * as todosRoutes from './routes/todos';


// Local config file.
var config = require('../config.js');

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);

var MongoStore = require('connect-mongo')(session);

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
    }, store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: config.sessionCollection
    })
}));

app.use(bodyParser.json());

// Passport requirements
app.use(passport.initialize());
app.use(passport.session());

// Pretty logs
app.use(morgan('dev'));

// All other routes are static
app.use(express.static('public'));

// Express static routesv
app.route('/').get(staticRoutes.index);
app.route('/keys/:email').get(authRoutes.getKeys);
app.route('/challenge').post(authRoutes.getChallenge);
app.route('/login').post(authRoutes.login);
app.route('/logout').get(authRoutes.logout);

// Todos routes. Require correct session
app.route('/todos').get(todosRoutes.get);
app.route('/todos').post(todosRoutes.create);

// Listen on desired port
server.listen(config.port);

console.log("Server started on port:" + config.port);
