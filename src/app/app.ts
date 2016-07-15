/// <reference path="./typings/index.d.ts" />

import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import passport = require('passport');
import session = require('express-session');
import morgan = require('morgan');
import restfulRoutes = require('./routes/restful');

import staticRoutes = require('./routes/static');


// Local config file.
var config = require('../config.js');

// Connect to database.
mongoose.connect(config.mongo_url);

// Set up express and Socket.IO
var app = express();
var server = require('http').createServer(app);
// var io = require('socket.io')(server);
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// var MongoStore = require('connect-mongo')(session);

// Express MongoDB session storage
/* app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: config.sessionCollection
    })
}));
*/
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

// Express static routes
app.route('/').get(staticRoutes.index);
//app.route('/reviewer.html').get(staticRoutes.exam);
//app.route('/reference.html').get(staticRoutes.entrance);
//app.route('/admin.html').get(staticRoutes.admin);
//app.route('/student.html').get(staticRoutes.proctor);

// RESTful routes

// app.route('/semesters').get();

/* 
app.route('/students/signup').post(restfulRoutes.signupStudent);
app.route('/proctors/signup').post(restfulRoutes.signupProctor);
app.route('/proctors/signin').post(restfulRoutes.signinProctor);
app.route('/proctors').get(restfulRoutes.getProctors);

// Params
app.param('studentID', restfulRoutes.studentByID);
app.param('proctorID', restfulRoutes.proctorByID);

// Student and proctor info
app.route('/proctors/:proctorID').get(restfulRoutes.sendUser);
app.route('/students/:studentID').get(restfulRoutes.sendUser);

// Profile picture routes
app.post('/profile', upload.single('avatar'), restfulRoutes.uploadHandler);

// SocketIO messages
io.on('connection', messageHandler.connection);
*/

console.log("Server started on port:" + config.port);
