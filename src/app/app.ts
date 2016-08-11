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
import * as keysRoutes from './routes/keys';

// Local config file.
var config = require('../config.js');

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);

function loggedIn(req: express.Request, res: express.Response, next: Function) {
    if (req.user) { // passport filled in the user
        next();
    } else {
        res.status(401).send("Must be logged in to use this route.");
    }
}

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
    }/*, store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: config.sessionCollection
    })*/
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
app.route('/keys/:email').get(loggedIn, authRoutes.getKeys);
app.route('/challenge').post(authRoutes.getChallenge);
app.route('/prelogin').post(authRoutes.prelogin);
app.route('/login').post(loggedIn, authRoutes.login);
app.route('/logout').get(loggedIn, authRoutes.logout);

// Device Routes
app.route('/keys/').get(loggedIn, keysRoutes.get);
app.route('/keys/:keyID').delete(loggedIn, keysRoutes.deleteK);

// Todos CRUD routes. Require correct session
app.route('/todo').get(loggedIn, todosRoutes.get); // all of user's todos
app.route('/todo').post(loggedIn, todosRoutes.create);
app.route('/todo/:ID').put(loggedIn, todosRoutes.update);
app.route('/todo/:ID').delete(loggedIn, todosRoutes.remove);
// Listen on desired port
server.listen(config.port);

console.log("Server started on port:" + config.port);
