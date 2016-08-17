/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains the implementation of the authentication related routes
 * A lot of these routes pass over the info to the 2Q2R server for the functionality.
 */

import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as ChallengeStrategy} from 'passport-challenge';

var unirest = require('unirest');

import {Users} from '../models';
import {Keys} from '../models';
import * as server2Q2R from './2Q2R-server';

var pending: { [challenge: string]: string } = {}

interface IKeyInfo {
    type: "2q2r" | "u2f"; // key type
    name: string; // displayable name 
}

// Maps from keyID => key description
type IKeys =
    { [keyID: string]: IKeyInfo };

// Login challenge
passport.use(new LocalStrategy(
    (username: string, password: string, done: Function) => {
        console.log("Login: ", username, password);
        Users.checkPasswd(username, password).then(
            (user) => { // good password, ask for the keys of this user 
                console.log("User: ", user);
                done(null, user);
            }, (error) => {
                done(null, false, { message: error.message });
            });
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new ChallengeStrategy(
    {
        signatureField: "keyID"
    },
    (username: string, challenge: string, keyID: string, done: Function) => {
        server2Q2R.post("/auth/server", {
            userID: username,
            challenge: challenge,
            keyID: keyID
        }).then((reply) => { // 2FA client authenticated on /auth route
            done(null, reply);
        }, (error) => { // some error during authentication
            done(null, false, { message: error.message });
        })
    }
))

// POST: /prelogin
// Validate user and provide set of available keys
export function prelogin(req: express.Request, res: express.Response) {
    res.status(200).send("1FA Succesful");
};

// POST: /login
export function login(req: express.Request, res: express.Response) {
    res.status(200).send("2FA Succesful");
};

// GET: /logout
export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.status(200).send("Succesfully logged out");
};

// POST: /preregister 
export function preRegister(req: express.Request, res: express.Response) {
    var userID = req.params.userID;
    Keys.exists(userID).then(
        (exists) => { // we already have key for this user
            console.log("Exists:", exists);
            if (exists)
                res.status(401).send("User already exists");
            else {
                server2Q2R.post("/register/challenge", {
                    userID: userID
                }).then(
                    (rep: any) => {
                        pending[rep.challenge] = userID;
                        res.json(rep);
                    }, (error) => {
                        res.status(error.status).send(error.message);
                    });
            }
        }, (error) => {
            console.log(error);
            res.status(401).send("Cound not complete request");
        }
    )
}

// POST: /register 
export function register(req: express.Request, res: express.Response) {
    var userID = req.body.userID;
    var passwd = req.body.password;
    var challenge = req.body.challenge;

    console.log("User: ", userID, " Challenge:", challenge);
    console.log("Session: ", req.session);

    var pendignUser = pending[challenge];

    if (pending[challenge] !== userID)
        res.status(401).send("Pre-register not called or incorrect info");
    else
        server2Q2R.post("/register/server", {
            userID: userID,
            challenge: challenge
        }).then((rep: any) => {
            Users.register(userID, passwd)
                .then(
                (user) => {
                    res.status(200).send("Registration succesful");
                }, (err) => {
                    res.status(400).send(err);
                });
        }, (error) => {
            res.status(500).send(error);
        })
};

// GET: /challenge/:keyID
export function getChallenge(req: express.Request, res: express.Response) {
    var keyID = req.params.keyID;
    var userID = req.user.userid;

    server2Q2R.post('/auth/challenge', {
        userID: userID,
        keyID: keyID
    }).then( (rep: any) => {
        res.json(rep);
    });
};
