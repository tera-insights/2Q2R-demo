/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import { Keys } from '../models';

// GET: /keys/
export function get(req: express.Request, res: express.Response) {
    Keys.get(req.body.username).then(
        (keys) => {
            res.json(keys);
        }, (error) => {
            res.status(401).send(error);
        }
    );
}

// DELETE /keys/:keyID
export function deleteK(req: express.Request, res: express.Response) {
    Keys.delete(req.params.keyID).then(
        () => {
            res.status(200).send("OK");
        }, (error) => {
            res.status(401).send("Could not delete key");
        }
    );
}
