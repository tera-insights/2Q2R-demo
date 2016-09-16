/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as server2Q2R from '../routes/2Q2R-server';

export function addDevice(req: express.Request, res: express.Response) {
    console.log("User: ", req.user);
    var userID = req.user.userid;

    server2Q2R.get("/v1/register/request/" + userID)
        .then((rep: any) => {
            res.json(rep);
        }, (error) => {
            console.log("Error: ", error);
            res.status(401).send(error);
        });
}

export function removeDevice(req: express.Request, res: express.Response) {
    console.log("User: ", req.user);
    var userID = req.user.userid;

    server2Q2R.get("/v1/key/request/" + userID)
        .then((rep: any) => {
            res.json(rep);
        }, (error) => {
            console.log("Error: ", error);
            res.status(401).send(error);
        });
}
