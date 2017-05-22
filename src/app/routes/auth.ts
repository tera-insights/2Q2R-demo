/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains the implementation of the authentication related routes
 * A lot of these routes pass over the info to the 2Q2R server for the functionality.
 */

import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import * as crypto from 'crypto';
import * as URLSafeBase64 from 'urlsafe-base64';
import {Strategy as LocalStrategy} from "passport-local";

var APIStrategy = require('passport-localapikey').Strategy;
var unirest = require('unirest');

import {Users} from '../models';
import {Keys} from '../models';
import * as server2Q2R from './2Q2R-server';

var pending: { [challenge: string]: { userID: string, nonce: string } } = {}

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
                //                console.log("User: ", user);

                done(null, user);
            }, (error) => {
                console.log("Error: ", error);
                done(null, false, { message: error.message });
            });
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new APIStrategy({
    apiKeyField: "request"
}, (id: string, done: Function) => {
    server2Q2R.get("/v1/auth/" + id + "/wait")
        .then((reply) => { // 2FA client authenticated on /auth route
            done(null, reply);
        }, (error) => { // some error during authentication
            done(null, false, { message: error.message });
        })
}
))

// POST: /prelogin
// Validate user and provide set of available keys
export function prelogin(req: express.Request, res: express.Response) {
    var userID = req.body.username;
    // Generate 256 bit nonce
    let nonce: string = URLSafeBase64.encode(crypto.randomBytes(32).toString('hex'))
    server2Q2R.get("/v1/auth/request/" + userID + "/" + nonce).then((rep: any) => {
        pending[rep.id] = { userID, nonce };
        if (pending[rep.id].nonce !== rep.nonce) {
            res.status(502).send("Server returned incorrect authentication");
        } else {
            res.json(rep);
        }
    }, (error) => {
        console.log("Error: ", error);
        res.status(401).send(error);
    });
};

// POST: /login
export function login(req: express.Request, res: express.Response) {
    req.session["secondFactor"] = "2Q2R";
    res.status(200).send("2FA Successful");
};

// GET: /logout
export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.status(200).send("Successfully logged out");
};

// POST: /preregister 
export function preRegister(req: express.Request, res: express.Response) {
    var userID = req.params.userID;
    // Generate 256 bit nonce
    let nonce: string = URLSafeBase64.encode(crypto.randomBytes(32).toString('hex'))
    Keys.exists(userID).then(
        (exists) => { // we already have key for this user
            console.log("Exists:", exists);
            if (exists)
                res.status(401).send("User already exists");
            else {
                server2Q2R.get("/v1/register/request/" + userID + "/" + nonce).then(
                    (rep: any) => {
                        pending[rep.id] = { userID, nonce };
                        console.log(pending[rep.id].nonce, rep.nonce)
                        if (pending[rep.id].nonce !== rep.nonce) {
                            res.status(502).send("Server returned incorrect authentication");
                        } else {
                            res.json(rep);
                        }
                    }, (error) => {
                        res.status(error.status).send(error.message);
                    });
            }
        }, (error) => {
            console.log(error);
            res.status(401).send("Could not complete request");
        }
    )
}

// POST: /register 
export function register(req: express.Request, res: express.Response) {
    var userID = req.body.userID;
    var passwd = req.body.password;
    var requestID = req.body.request;

    console.log("User: ", userID, " RequestID:", requestID);
    console.log("Session: ", req.session);

    var pendingUser = pending[requestID];

    if (pending[requestID].userID !== userID){
        console.log("REGISTRATION FAILED")
        console.log(pending, userID)
        res.status(401).send("Pre-register not called or incorrect info");
    }
    else
        server2Q2R.get("/v1/register/" + requestID + "/wait")
            .then((rep: any) => {
                console.log("Register: ", rep);
                Users.register(userID, passwd)
                    .then(
                    (user) => {
                        res.status(200).send("Registration successful");
                    }, (err) => {
                        res.status(400).send(err);
                    });
            }, (error) => {
                res.status(500).send(error);
            })
};
