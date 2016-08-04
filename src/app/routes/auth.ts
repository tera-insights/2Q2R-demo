/// <reference path="../../typings/index.d.ts" />

/**
 * This file contains the implementation of the authentication related routes
 * A lot of these routes pass over the info to the 2Q2R server for the functionality.
 */

import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';

var unirest = require('unirest');
var config = require('../../config');

var ChallengeStrategy = require('passport-challenge').Strategy;

interface IKeyInfo {
    type: "2q2r" | "u2f"; // key type
    name: string; // displayable name 
}

// Maps from keyID => key description
type IKeys =
    { [keyID: string]: IKeyInfo };

// Login challenge
passport.use(new ChallengeStrategy({
    usernameField: 'email',
    challengeField: 'challenge',
    signatureField: 'keyID'
}, function(username, challenge, keyID, done) {
    unirest.post(config.backendUrl)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send({
            email: username,
            challenge: challenge,
            keyID: keyID,
            appID: config.appID,
            apiKey: config.apiKey
        })
        .end(function(response) {
            console.log(response);
            if (response.error) {
                done(null, false, { message: 'SubmissionFailed' });
            } else {
                done(null, response.body);
            }
        });
}));

// GET: /keys/email
export function getKeys(req: express.Request, res: express.Response) {
    var email = req.params.email;
    res.send({
        user: email,
        keys: {}
    });
};


// POST: /challenge
export function getChallenge(req: express.Request, res: express.Response) {
    var email = req.body.email;
    var keyID = req.body.keyID;
    res.send({
        challenge: "bogus",
        appID: "weird",
        keyID: keyID,
        user: email
    });
};

// POST: /prelogin
// Validate user and provide set of available keys
export function prelogin(req: express.Request, res: express.Response) {
    var username = req.body.username;
    var password = req.body.password;

    // send fake answer
    var keys: IKeys = {
        "1875439uefriowrquwerp": { type: "2q2r", name: "Lg 3" },
        "1875439uefrfdasfdasiowrquwerp": { type: "2q2r", name: "My IFone" },
        "72943842904293419782341": { type: "u2f", name: "Yubikey" },
        "7294384290419782341": { type: "u2f", name: "SecurityKey" }
    };
    res.send({
        keys: keys,
        token: 'fiquworieuqwoeruqopwiuroiqwureio'
    });
};

// POST: /login
export function login(req: express.Request, res: express.Response) {
    var email = req.body.email;
    var keyID = req.body.keyID;
    var challenge = req.body.challenge;
    res.send(email);
};

// GET: /logout
export function logout(req: express.Request, res: express.Response) {
    var user = req.body.email;
    res.send(user);
};
