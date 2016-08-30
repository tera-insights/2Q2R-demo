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
import * as deviceRoutes from './routes/devices';
import {sequelize} from './models';

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);

function primaryFactorIn(req: express.Request, res: express.Response, next: Function) {
    console.log("Request: ", req.user);
    if (req.user) { // passport filled in the user
        next();
    } else {
        res.status(401).send("Must be logged in to use this route.");
    }
}


function secondFactorIn(req: express.Request, res: express.Response, next: Function) {
    if (req.session["secondFactor"] === '2Q2R') {
        next();
    } else {
        res.status(401).send("This route requires second factor authentication");
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

// Express static routes
app.route('/').get(staticRoutes.index);

app.route('/prelogin').post(passport.authenticate('local'), authRoutes.prelogin);
app.route('/login').post(primaryFactorIn, passport.authenticate('localapikey', { session: false }), authRoutes.login);
app.route('/logout').get(primaryFactorIn, authRoutes.logout);
app.route('/preregister/:userID').get(authRoutes.preRegister);
app.route('/register').post(authRoutes.register);

app.route('/device/add').get(primaryFactorIn, secondFactorIn, deviceRoutes.addDevice);
app.route('/device/delete').get(primaryFactorIn, secondFactorIn, deviceRoutes.removeDevice);

// Todos CRUD routes. Require full session
app.route('/todo').get(primaryFactorIn, secondFactorIn, todosRoutes.get); // all of user's todos
app.route('/todo').post(primaryFactorIn, secondFactorIn, todosRoutes.create);
app.route('/todo/:ID').put(primaryFactorIn, secondFactorIn, todosRoutes.update);
app.route('/todo/:ID').delete(primaryFactorIn, secondFactorIn, todosRoutes.remove);

// This is critical. Without it, the schema is not created
sequelize.sync();

// Listen on desired port
var port = config.get("port");
server.listen(port);

console.log("Server started on port:" + port);
