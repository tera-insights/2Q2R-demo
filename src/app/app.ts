/// <reference path="../typings/index.d.ts" />

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as config from 'config';

import * as staticRoutes from './routes/static';
import * as authRoutes from './routes/auth';
import * as todosRoutes from './routes/todos';
import * as keysRoutes from './routes/keys';
import {sequelize} from './models';

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

var sessionCookie: any = config.get("sessionCookie");

var Store = require('express-sequelize-session')((<any>session).Store);
app.use(session({
    name: "2Q2R",
    saveUninitialized: true,
    resave: true,
    secret: <string>config.get("sessionSecret"),
    cookie: {
        maxAge: sessionCookie.maxAge,
        httpOnly: sessionCookie.httpOnly,
        secure: sessionCookie.secure // && config.secure.ssl
    },
    store: new Store(sequelize)
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
app.route('/login').post(passport.authenticate('local'), authRoutes.login);
app.route('/logout').get(loggedIn, authRoutes.logout);
app.route('/register').post(authRoutes.register);

// Device Routes
app.route('/keys/').get(loggedIn, keysRoutes.get);
app.route('/keys/:keyID').delete(loggedIn, keysRoutes.deleteK);

// Todos CRUD routes. Require correct session
app.route('/todo').get(loggedIn, todosRoutes.get); // all of user's todos
app.route('/todo').post(loggedIn, todosRoutes.create);
app.route('/todo/:ID').put(loggedIn, todosRoutes.update);
app.route('/todo/:ID').delete(loggedIn, todosRoutes.remove);

// This is critical. Without it, the schema is not created
sequelize.sync();

// Listen on desired port
var port = config.get("port");
server.listen(port);

console.log("Server started on port:" + port);
